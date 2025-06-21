// Input validation and sanitization
import { securityLogger } from './security-logger';

interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email' | 'date' | 'url';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  allowedValues?: any[];
  customValidator?: (value: any) => boolean | string;
}

interface ValidationSchema {
  [key: string]: ValidationRule;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  sanitizedData: any;
  threats: string[];
}

export class InputValidator {
  // 危険なパターンの検出
  private static readonly THREAT_PATTERNS = {
    SQL_INJECTION: [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(\'|\"|;|--|\||\*)/,
      /(\bOR\b|\bAND\b).*[\'"]/i,
      /\b(WAITFOR|DELAY)\b/i
    ],
    XSS: [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<img[^>]*src\s*=\s*["']?javascript:/gi,
      /eval\s*\(/gi,
      /expression\s*\(/gi
    ],
    PATH_TRAVERSAL: [
      /\.\.\//g,
      /\.\.\\/, 
      /%2e%2e%2f/gi,
      /%2e%2e%5c/gi,
      /\.\.\%2f/gi,
      /\.\.\%5c/gi
    ],
    COMMAND_INJECTION: [
      /[;&|`$(){}[\]]/,
      /\b(ls|cat|pwd|id|whoami|ps|netstat|ifconfig|ping|wget|curl)\b/i,
      /[<>]/
    ],
    LDAP_INJECTION: [
      /[()=*!&|]/,
      /\x00/,
      /[\x01-\x1F\x7F]/
    ]
  };

  // HTMLエンティティエスケープマップ
  private static readonly HTML_ENTITIES: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };

  /**
   * データ検証
   */
  static async validate(
    data: any,
    schema: ValidationSchema,
    context: { ip?: string; userId?: string; path?: string } = {}
  ): Promise<ValidationResult> {
    const errors: string[] = [];
    const threats: string[] = [];
    const sanitizedData: any = {};

    for (const [field, rule] of Object.entries(schema)) {
      const value = data[field];
      
      // 必須チェック
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      // 値が存在しない場合はスキップ
      if (value === undefined || value === null) {
        continue;
      }

      try {
        // 脅威検出
        const detectedThreats = this.detectThreats(value, field);
        threats.push(...detectedThreats);

        // 型チェック
        const typeValidation = this.validateType(value, rule.type || 'string');
        if (!typeValidation.valid) {
          errors.push(`${field}: ${typeValidation.error}`);
          continue;
        }

        // 長さチェック（文字列）
        if (typeof value === 'string') {
          if (rule.minLength && value.length < rule.minLength) {
            errors.push(`${field}: minimum length is ${rule.minLength}`);
          }
          if (rule.maxLength && value.length > rule.maxLength) {
            errors.push(`${field}: maximum length is ${rule.maxLength}`);
          }
        }

        // 範囲チェック（数値）
        if (typeof value === 'number') {
          if (rule.min !== undefined && value < rule.min) {
            errors.push(`${field}: minimum value is ${rule.min}`);
          }
          if (rule.max !== undefined && value > rule.max) {
            errors.push(`${field}: maximum value is ${rule.max}`);
          }
        }

        // パターンチェック
        if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
          errors.push(`${field}: format is invalid`);
        }

        // 許可値チェック
        if (rule.allowedValues && !rule.allowedValues.includes(value)) {
          errors.push(`${field}: value not allowed`);
        }

        // カスタムバリデーター
        if (rule.customValidator) {
          const customResult = rule.customValidator(value);
          if (typeof customResult === 'string') {
            errors.push(`${field}: ${customResult}`);
          } else if (!customResult) {
            errors.push(`${field}: custom validation failed`);
          }
        }

        // サニタイズ
        sanitizedData[field] = this.sanitize(value, rule.type || 'string');

      } catch (error) {
        errors.push(`${field}: validation error`);
        console.error(`Validation error for field ${field}:`, error);
      }
    }

    // 脅威が検出された場合、セキュリティログに記録
    if (threats.length > 0) {
      await this.logSecurityThreat(threats, data, context);
    }

    return {
      valid: errors.length === 0 && threats.length === 0,
      errors,
      sanitizedData,
      threats
    };
  }

  /**
   * 型検証
   */
  private static validateType(value: any, type: string): { valid: boolean; error?: string } {
    switch (type) {
      case 'string':
        if (typeof value !== 'string') {
          return { valid: false, error: 'must be a string' };
        }
        break;

      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          return { valid: false, error: 'must be a valid number' };
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          return { valid: false, error: 'must be a boolean' };
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof value !== 'string' || !emailRegex.test(value)) {
          return { valid: false, error: 'must be a valid email address' };
        }
        break;

      case 'date':
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return { valid: false, error: 'must be a valid date' };
        }
        break;

      case 'url':
        try {
          new URL(value);
        } catch {
          return { valid: false, error: 'must be a valid URL' };
        }
        break;

      default:
        return { valid: false, error: 'unknown type' };
    }

    return { valid: true };
  }

  /**
   * 脅威検出
   */
  private static detectThreats(value: any, field: string): string[] {
    const threats: string[] = [];
    const stringValue = String(value).toLowerCase();

    // SQL Injection
    for (const pattern of this.THREAT_PATTERNS.SQL_INJECTION) {
      if (pattern.test(stringValue)) {
        threats.push(`sql_injection:${field}`);
        break;
      }
    }

    // XSS
    for (const pattern of this.THREAT_PATTERNS.XSS) {
      if (pattern.test(stringValue)) {
        threats.push(`xss:${field}`);
        break;
      }
    }

    // Path Traversal
    for (const pattern of this.THREAT_PATTERNS.PATH_TRAVERSAL) {
      if (pattern.test(stringValue)) {
        threats.push(`path_traversal:${field}`);
        break;
      }
    }

    // Command Injection
    for (const pattern of this.THREAT_PATTERNS.COMMAND_INJECTION) {
      if (pattern.test(stringValue)) {
        threats.push(`command_injection:${field}`);
        break;
      }
    }

    // LDAP Injection
    for (const pattern of this.THREAT_PATTERNS.LDAP_INJECTION) {
      if (pattern.test(stringValue)) {
        threats.push(`ldap_injection:${field}`);
        break;
      }
    }

    return threats;
  }

  /**
   * サニタイゼーション
   */
  private static sanitize(value: any, type: string): any {
    if (typeof value !== 'string') {
      return value;
    }

    let sanitized = value;

    // HTML エンティティエスケープ
    sanitized = sanitized.replace(/[&<>"'/]/g, (char) => 
      this.HTML_ENTITIES[char] || char
    );

    // 制御文字除去
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

    // タイプ固有のサニタイゼーション
    switch (type) {
      case 'email':
        sanitized = sanitized.trim().toLowerCase();
        break;

      case 'string':
        // 先頭・末尾の空白除去
        sanitized = sanitized.trim();
        // 連続する空白を単一の空白に
        sanitized = sanitized.replace(/\s+/g, ' ');
        break;

      case 'url':
        sanitized = sanitized.trim();
        break;
    }

    return sanitized;
  }

  /**
   * セキュリティ脅威ログ
   */
  private static async logSecurityThreat(
    threats: string[],
    data: any,
    context: { ip?: string; userId?: string; path?: string }
  ): Promise<void> {
    for (const threat of threats) {
      const [threatType, field] = threat.split(':');
      
      await securityLogger.logSecurityEvent({
        type: threatType as any,
        ip: context.ip || 'unknown',
        path: context.path,
        userId: context.userId,
        details: {
          field,
          suspiciousValue: data[field],
          allThreats: threats
        },
        timestamp: new Date()
      });
    }
  }

  /**
   * 事前定義されたスキーマ
   */
  static readonly SCHEMAS = {
    // ユーザー登録
    USER_REGISTRATION: {
      email: {
        required: true,
        type: 'email' as const,
        maxLength: 255
      },
      password: {
        required: true,
        type: 'string' as const,
        minLength: 8,
        maxLength: 128,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
      },
      fullName: {
        required: true,
        type: 'string' as const,
        minLength: 1,
        maxLength: 100
      }
    },

    // 数秘術入力
    NUMEROLOGY_INPUT: {
      fullName: {
        required: true,
        type: 'string' as const,
        minLength: 1,
        maxLength: 200,
        pattern: /^[a-zA-Zａ-ｚＡ-Ｚ\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s\-\.]+$/
      },
      birthDate: {
        required: true,
        type: 'string' as const,
        pattern: /^\d{4}-\d{2}-\d{2}$/,
        customValidator: (value: string) => {
          const date = new Date(value);
          const now = new Date();
          const minDate = new Date('1900-01-01');
          return date >= minDate && date <= now;
        }
      }
    },

    // タロット入力
    TAROT_INPUT: {
      question: {
        required: true,
        type: 'string' as const,
        minLength: 5,
        maxLength: 500
      },
      spreadType: {
        required: true,
        type: 'string' as const,
        allowedValues: ['single_card', 'three_card', 'five_card', 'celtic_cross', 'horseshoe']
      },
      seed: {
        required: false,
        type: 'string' as const,
        maxLength: 100
      }
    },

    // 管理者アクション
    ADMIN_ACTION: {
      action: {
        required: true,
        type: 'string' as const,
        allowedValues: ['clear_cache', 'preload_engines', 'gc', 'view_logs', 'export_data']
      },
      reason: {
        required: false,
        type: 'string' as const,
        maxLength: 500
      }
    },

    // 占星術入力
    ASTROLOGY_INPUT: {
      birthDate: {
        required: true,
        type: 'string' as const,
        pattern: /^\d{4}-\d{2}-\d{2}$/
      },
      birthTime: {
        required: true,
        type: 'string' as const,
        pattern: /^\d{2}:\d{2}$/
      },
      latitude: {
        required: true,
        type: 'number' as const,
        min: -90,
        max: 90
      },
      longitude: {
        required: true,
        type: 'number' as const,
        min: -180,
        max: 180
      },
      timezone: {
        required: true,
        type: 'string' as const,
        maxLength: 50
      }
    }
  };

  /**
   * クイック検証（基本的なケース用）
   */
  static async quickValidate(
    data: any,
    schemaName: keyof typeof InputValidator.SCHEMAS,
    context: { ip?: string; userId?: string; path?: string } = {}
  ): Promise<ValidationResult> {
    const schema = this.SCHEMAS[schemaName];
    return this.validate(data, schema, context);
  }

  /**
   * ファイルアップロード検証
   */
  static validateFileUpload(file: {
    name: string;
    size: number;
    type: string;
    buffer?: Buffer;
  }): { valid: boolean; errors: string[]; threats: string[] } {
    const errors: string[] = [];
    const threats: string[] = [];

    // ファイル名検証
    const nameThreats = this.detectThreats(file.name, 'filename');
    threats.push(...nameThreats);

    // 許可された拡張子
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt', '.csv'];
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(extension)) {
      errors.push('File type not allowed');
    }

    // ファイルサイズ制限（10MB）
    if (file.size > 10 * 1024 * 1024) {
      errors.push('File size exceeds 10MB limit');
    }

    // MIME タイプ検証
    const allowedMimeTypes = [
      'image/jpeg', 'image/png', 'image/gif',
      'application/pdf', 'text/plain', 'text/csv'
    ];
    
    if (!allowedMimeTypes.includes(file.type)) {
      errors.push('MIME type not allowed');
    }

    // ファイル内容のマジックナンバーチェック（可能な場合）
    if (file.buffer && this.containsMaliciousContent(file.buffer)) {
      threats.push('malicious_file_content');
    }

    return {
      valid: errors.length === 0 && threats.length === 0,
      errors,
      threats
    };
  }

  /**
   * 悪意のあるファイル内容検出
   */
  private static containsMaliciousContent(buffer: Buffer): boolean {
    const content = buffer.toString('utf8', 0, Math.min(buffer.length, 1024));
    
    // スクリプトタグや実行可能なコードの検出
    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /%3Cscript/i,
      /eval\(/i,
      /exec\(/i,
      /system\(/i
    ];

    return maliciousPatterns.some(pattern => pattern.test(content));
  }
}

// バリデーションエラークラス
export class ValidationError extends Error {
  constructor(
    public errors: string[],
    public threats: string[] = [],
    public field?: string
  ) {
    super(`Validation failed: ${errors.join(', ')}`);
    this.name = 'ValidationError';
  }
}

// ヘルパー関数
export function createValidationMiddleware(
  schema: ValidationSchema,
  options: { throwOnError?: boolean; logThreats?: boolean } = {}
) {
  return async function(data: any, context: any = {}) {
    const result = await InputValidator.validate(data, schema, context);
    
    if (!result.valid) {
      if (options.throwOnError) {
        throw new ValidationError(result.errors, result.threats);
      }
      return { success: false, errors: result.errors, threats: result.threats };
    }

    return { success: true, data: result.sanitizedData };
  };
}