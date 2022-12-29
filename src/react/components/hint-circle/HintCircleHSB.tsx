import { CSSProperties, ReactElement } from 'react'
import { _HintCircle as HintCircleElement, _HintCircleQuadrant as HCQuadrant } from './hintCircleLayout'
import { HintDisplayProps } from './HintCircle'
import { HintItem, HSBHint } from '../../../lib/puzzle/hint/hint'
import { renderHintDisplayCentre } from './hintCircleCommon'
import { HSBColor, toCssColour, toHSB } from '../../../lib/colour/colourConversions'
import { bounded } from '../../../lib/math/math'
import { rotateHue } from '../../../lib/colour/colourMath'

export interface HintDisplayHSBProps extends HintDisplayProps {
  hint: HSBHint
}

function showValueInQuadrant(hintItem: HintItem | undefined, signPositive: boolean): boolean {
  let show = false
  if (hintItem !== undefined) {
    if (hintItem.match) show = true
    if (Math.sign(hintItem.diff) === Math.sign(signPositive ? 1 : -1)) show = true
  }
  return show
}

function getCssGradiant(hint: HSBHint, top: boolean, right: boolean): string {
  let innerColour = toHSB(hint.guessedColour)
  let outerColour: HSBColor = {
    h: rotateHue(innerColour.h, hint.hue?.diff ?? 0),
    s: bounded(innerColour.s + (hint.saturation?.diff ?? 0), 0, 100),
    b: bounded(innerColour.b + (hint.brightness?.diff ?? 0), 0, 100),
  }
  if (hint.hue === undefined) {
    innerColour = { h: innerColour.h, s: 0, b: innerColour.b }
    outerColour = { h: outerColour.h, s: 0, b: outerColour.b }
  }
  return `radial-gradient(circle at ${right ? 0 : 100}% ${top ? 100 : 0}%, ${toCssColour(
    innerColour
  )} 10%, ${toCssColour(outerColour)} 75%)`
}

function renderQuadrant(hint: HSBHint, top: boolean, right: boolean): ReactElement {
  const show = showValueInQuadrant(hint.brightness, top) && showValueInQuadrant(hint.saturation, right)
  const style: CSSProperties = {
    backgroundImage: show ? getCssGradiant(hint, top, right) : undefined,
  }
  return <HCQuadrant style={style} />
}

export function HintCircleHSB(props: HintDisplayHSBProps): ReactElement {
  const { hint, onClick } = props

  return (
    <HintCircleElement>
      {renderQuadrant(hint, true, false)}
      {renderQuadrant(hint, true, true)}
      {renderQuadrant(hint, false, false)}
      {renderQuadrant(hint, false, true)}
      {renderHintDisplayCentre(hint.guessedColour, () => onClick?.(hint))}
    </HintCircleElement>
  )
}
