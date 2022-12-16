import styled from 'styled-components'
import { headerLayout } from '../../components/page/headerLayout'
import { footerLayout } from '../../components/page/footerLayout'
import { bodyLayout } from '../../components/page/bodyLayout'
import { windowLayout } from '../../components/page/windowLayout'

export const playingViewLayout = {
  border: {
    lower: 1,
  },
  height: {
    lower: 200,
    lowerContents: -999,
    divider: 10,
  },
  padding: {
    lower: 0,
  },
  windowHeightMinusUpper: -999,
}
playingViewLayout.windowHeightMinusUpper =
  windowLayout.padding.topBottom +
  headerLayout.height +
  bodyLayout.margin.top +
  bodyLayout.padding.topBottom +
  playingViewLayout.height.divider +
  playingViewLayout.height.lower +
  bodyLayout.padding.topBottom +
  bodyLayout.margin.bottom +
  footerLayout.height +
  windowLayout.padding.topBottom
playingViewLayout.height.lowerContents =
  playingViewLayout.height.lower - playingViewLayout.border.lower * 2 - playingViewLayout.padding.lower * 2

export const PlayingViewOuter = styled.div.attrs({
  className: 'playing-view-outer',
})`
  width: 100%;
  height: 100%;
`

export const PlayingViewUpperSection = styled.div.attrs({
  className: 'playing-view-upper-section',
})`
  height: calc(100% - ${playingViewLayout.height.lower}px - ${playingViewLayout.height.divider}px);
`

export const PlayingViewSectionDivider = styled.div.attrs({
  className: 'playing-view-section-divider',
})`
  background-color: ${(props) => props.theme.colours.background};
  height: ${playingViewLayout.height.divider}px;
`

export const PlayingViewLowerSection = styled.div.attrs({
  className: 'playing-view-lower-section',
})`
  height: ${playingViewLayout.height.lower}px;
  text-align: center;
  padding: ${playingViewLayout.padding.lower}px;
  box-sizing: border-box;
  border-width: ${playingViewLayout.border.lower}px;
  border-style: solid;
  border-color: ${(props) => props.theme.colours.border};
`
