import type { SceneMap } from '..'
import BetterCanvasScene from './better-canvas/Scene'
import EternalSummaryScene from './eternal-summary/Scene'
import HushtypeScene from './hushtype/Scene'
import SignatureCutsScene from './signature-cuts/Scene'

/** Product scenes in group b, keyed by product id. */
export const scenesB: SceneMap = {
  'better-canvas': BetterCanvasScene,
  'eternal-summary': EternalSummaryScene,
  hushtype: HushtypeScene,
  'signature-cuts': SignatureCutsScene,
}
