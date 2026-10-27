import type { SceneMap } from '..'
import EternalSummaryScene from './eternal-summary/Scene'
import HushtypeScene from './hushtype/Scene'

/** Product scenes in group b, keyed by product id. */
export const scenesB: SceneMap = {
  'eternal-summary': EternalSummaryScene,
  hushtype: HushtypeScene,
}
