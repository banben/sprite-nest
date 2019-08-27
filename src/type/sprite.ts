/**
 * Crawler extend methods
 */
export interface Sprite {
  home: string;
  // getList?: SpriteMethod;
  // getDetail?: SpriteMethod;
}

export interface SpriteMethod {
  (config: object): Promise<any>;
  (config: object): void;
}

/**
 * Lipstick types
 */
export interface LipstickSprite extends Sprite {
  brand: string;
}

export interface LipstickObject {
  brand: string;
  name?: string;
  e_name?: string;
  description?: string;
  url: string;
  price?: string;
  colors?: LipstickColor[];
}

export interface LipstickResult {
  brand: string;
  data: LipstickObject[];
}
/**
 * text describle, hex color and color image of lipstick's color
 */
export interface LipstickColor {
  color_hex?: string;
  color_text?: string;
  color_image?: string;
  color_rgb?: Array<number>;
  color_hsl?: Array<number>;
}

/**
 * Search types
 */

export interface SearchSprite extends Sprite {
  platform: string;
}

export interface SearchObject {
  title: string;
  url: string;
  displayUrl: string;
  content: string;
}

export interface SearchResult {
  platform: string;
  keyword: string;
  data: SearchObject[];
}

/**
 * SNS types
 */

export interface SNSSprite extends Sprite {
  platform: string;
}

export interface SNSObject {
  albumUrl: string;
  photos: Array<string>;
}


export interface SNSResult {
  platform: string;
  target: string;
  data: SNSObject[];
}

export interface AccountType {
  username: string;
  password: string;
}

/**
 * Translator types
 */

export interface TranslatorSprite extends Sprite {
  platform: string;
  language?: string;
}

/**
 * origin and target content of translator
 */
export interface TranslatorObject {
  language?: string;
  origin: string;
  target?: string;
}


export interface TranslatorResult {
  platform: string;
  content: string;
  data: TranslatorObject;
}

/**
 * Cluster and PPTR config
 */
export interface CustomConfig {
  cluster?: object;
  pptr?: object;
}

export interface ResponseObj {
  data: Array<any> | Object;
  status: boolean;
}