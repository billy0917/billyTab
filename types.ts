export interface Shortcut {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export interface InspirationData {
  quote: string;
  author: string;
  tip: string;
}

export interface SearchEngine {
  name: string;
  url: string;
  queryParam: string;
}

export type WidgetSize = 'small' | 'medium' | 'large';
export type WidgetType = 'weather' | 'clock' | 'quote';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  size: WidgetSize;
  visible: boolean;
  order: number;
}