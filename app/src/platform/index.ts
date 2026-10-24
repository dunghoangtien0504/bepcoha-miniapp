import type { Platform } from './types'
import { webPlatform } from './web'
import { zaloPlatform } from './zalo'

export const IS_ZALO = import.meta.env.MODE === 'zalo'
export const platform: Platform = IS_ZALO ? zaloPlatform : webPlatform
export type { Platform, IdentifyMethod } from './types'
