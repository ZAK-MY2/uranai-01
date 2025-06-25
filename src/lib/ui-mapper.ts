/**
 * COSMIC ORACLE UI要素マッピングユーティリティ
 * UI要素の一意識別とアクセスを提供
 */

export type ElementType = 'button' | 'link' | 'input' | 'select' | 'textarea' | 
  'card' | 'section' | 'header' | 'nav' | 'modal' | 'toast';

export type ScreenName = 'entry' | 'input' | 'login' | 'dashboard' | 
  'integrated' | 'numerology' | 'tarot' | 'astrology' | 'iching' | 
  'runes' | 'vedic' | 'nine-star' | 'shichu-suimei' | 'celtic' | 'kabbalah';

export interface UIElement {
  id: string;
  type: ElementType;
  screen: ScreenName;
  selector?: string;
  ariaLabel?: string;
  testId?: string;
  action?: string;
  destination?: string;
  validation?: Record<string, any>;
  children?: string[];
}

export interface ScreenMap {
  name: ScreenName;
  path: string;
  title: string;
  elements: UIElement[];
}

/**
 * 要素ID生成ユーティリティ
 */
export function generateElementId(
  screen: ScreenName,
  type: ElementType,
  name: string
): string {
  return `${screen}-${type}-${name}`;
}

/**
 * 要素検索ユーティリティ
 */
export function findElement(
  elementId: string,
  screenMaps: ScreenMap[]
): UIElement | undefined {
  for (const screen of screenMaps) {
    const element = screen.elements.find(el => el.id === elementId);
    if (element) return element;
  }
  return undefined;
}

/**
 * DOM要素取得ユーティリティ
 */
export function getElementByUIId(elementId: string): HTMLElement | null {
  // data-ui-id属性で検索
  const element = document.querySelector(`[data-ui-id="${elementId}"]`);
  if (element) return element as HTMLElement;
  
  // id属性で検索
  return document.getElementById(elementId);
}

/**
 * 要素のアクション実行
 */
export function executeElementAction(
  elementId: string,
  screenMaps: ScreenMap[]
): void {
  const element = findElement(elementId, screenMaps);
  if (!element || !element.action) return;
  
  const domElement = getElementByUIId(elementId);
  if (!domElement) return;
  
  // アクションに基づいて処理実行
  switch (element.action) {
    case 'navigate':
      if (element.destination) {
        window.location.href = element.destination;
      }
      break;
    case 'submit':
      const form = domElement.closest('form');
      if (form) form.submit();
      break;
    case 'click':
      domElement.click();
      break;
    default:
      console.warn(`Unknown action: ${element.action}`);
  }
}

/**
 * スクリーンマップ定義
 */
export const screenMaps: ScreenMap[] = [
  {
    name: 'entry',
    path: '/entry',
    title: 'エントリー画面',
    elements: [
      {
        id: 'entry-header-title',
        type: 'header',
        screen: 'entry',
        ariaLabel: 'COSMIC ORACLE',
      },
      {
        id: 'entry-input-password',
        type: 'input',
        screen: 'entry',
        ariaLabel: 'アクセス用呪文入力',
        validation: {
          required: true,
          pattern: '^[a-zA-Z0-9]+$'
        }
      },
      {
        id: 'entry-button-enter',
        type: 'button',
        screen: 'entry',
        ariaLabel: '呪文を確認してアプリに入る',
        action: 'submit',
        destination: '/input'
      }
    ]
  },
  {
    name: 'dashboard',
    path: '/',
    title: 'ダッシュボード',
    elements: [
      {
        id: 'dashboard-header-main',
        type: 'header',
        screen: 'dashboard',
        children: ['dashboard-logo', 'dashboard-nav-user']
      },
      {
        id: 'dashboard-card-cosmic',
        type: 'section',
        screen: 'dashboard',
        ariaLabel: '今日の宇宙図',
      },
      {
        id: 'dashboard-card-numerology',
        type: 'card',
        screen: 'dashboard',
        ariaLabel: '数秘術カード',
        action: 'navigate',
        destination: '/divination/numerology'
      },
      {
        id: 'dashboard-card-tarot',
        type: 'card',
        screen: 'dashboard',
        ariaLabel: 'タロットカード',
        action: 'navigate',
        destination: '/divination/tarot'
      },
      {
        id: 'dashboard-button-integrated',
        type: 'button',
        screen: 'dashboard',
        ariaLabel: '統合占術を開始する',
        action: 'navigate',
        destination: '/divination/integrated'
      }
    ]
  },
  {
    name: 'input',
    path: '/input',
    title: '入力画面',
    elements: [
      {
        id: 'input-nav-progress',
        type: 'nav',
        screen: 'input',
        ariaLabel: '入力プログレス',
      },
      {
        id: 'input-input-fullname',
        type: 'input',
        screen: 'input',
        ariaLabel: 'お名前入力',
        validation: {
          required: true,
          minLength: 2,
          maxLength: 50
        }
      },
      {
        id: 'input-button-submit',
        type: 'button',
        screen: 'input',
        ariaLabel: '占術を開始する',
        action: 'submit',
        destination: '/divination/integrated'
      }
    ]
  }
];

/**
 * テスト用ユーティリティ
 */
export function getAllElementIds(): string[] {
  const ids: string[] = [];
  screenMaps.forEach(screen => {
    screen.elements.forEach(element => {
      ids.push(element.id);
    });
  });
  return ids;
}

/**
 * Reactコンポーネント用プロップス生成
 */
export function generateUIProps(elementId: string): Record<string, any> {
  const element = findElement(elementId, screenMaps);
  if (!element) return {};
  
  return {
    'data-ui-id': element.id,
    'aria-label': element.ariaLabel,
    'data-testid': element.testId || element.id,
  };
}

/**
 * アクセシビリティ検証
 */
export function validateAccessibility(elementId: string): string[] {
  const issues: string[] = [];
  const element = findElement(elementId, screenMaps);
  
  if (!element) {
    issues.push(`Element ${elementId} not found in UI map`);
    return issues;
  }
  
  // ARIAラベルチェック
  if (!element.ariaLabel && ['button', 'link', 'input'].includes(element.type)) {
    issues.push(`Missing aria-label for interactive element ${elementId}`);
  }
  
  // フォーム要素のバリデーションチェック
  if (element.type === 'input' && element.validation?.required && !element.ariaLabel) {
    issues.push(`Required input ${elementId} missing aria-label`);
  }
  
  return issues;
}

/**
 * ナビゲーションフロー分析
 */
export function analyzeNavigationFlow(): Map<string, string[]> {
  const flowMap = new Map<string, string[]>();
  
  screenMaps.forEach(screen => {
    const destinations: string[] = [];
    screen.elements.forEach(element => {
      if (element.destination) {
        destinations.push(element.destination);
      }
    });
    flowMap.set(screen.path, destinations);
  });
  
  return flowMap;
}

/**
 * デバッグ情報出力
 */
export function debugUIMap(): void {
  console.group('COSMIC ORACLE UI Map Debug Info');
  console.log(`Total screens: ${screenMaps.length}`);
  console.log(`Total elements: ${getAllElementIds().length}`);
  
  screenMaps.forEach(screen => {
    console.group(`Screen: ${screen.name} (${screen.path})`);
    console.log(`Elements: ${screen.elements.length}`);
    screen.elements.forEach(el => {
      console.log(`- ${el.id} (${el.type})`);
    });
    console.groupEnd();
  });
  
  console.groupEnd();
}