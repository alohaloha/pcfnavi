export interface NotionBlock {
  id: string;
  type: string;
  has_children?: boolean;
  [key: string]: any;
}

export interface RichText {
  type: string;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href?: string;
  [key: string]: any;
} 