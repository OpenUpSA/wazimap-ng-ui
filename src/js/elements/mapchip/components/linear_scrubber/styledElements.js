import { styled } from '@mui/system';
import SliderUnstyled, { sliderUnstyledClasses } from '@mui/base/SliderUnstyled';

export const ParentContainer = styled('div')(({ theme }) => ({
  padding: "15px 10px",
  margin: "auto",
  borderBottom: "1px solid #ebebeb",
}));

export const CustomSliderRail = styled('div')(({ theme }) => ({
  backgroundColor: "#aba9a952",
  height: "20px",
  borderRadius: "10px"
}));

export const StyledSlider = styled(SliderUnstyled)(
  ({ theme }) => `
  color: ${theme.palette.grey[500]};
  height: 4px;
  width: 90%;
  display: block;
  position: relative;
  cursor: pointer;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
  opacity: 0.75;
  margin: 0 auto;

  &:hover {
    opacity: 1;
  }

  &.${sliderUnstyledClasses.disabled} {
    pointer-events: none;
    cursor: default;
    color: #bdbdbd;
  }

  & .${sliderUnstyledClasses.rail} {
    display: block;
    position: absolute;
  }

  & .${sliderUnstyledClasses.thumb} {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background-color: currentColor;
    top: 5px;
    transform: scale(1.5) translateX(-50%);
    color: ${theme.palette.success.main};
  }


  & .${sliderUnstyledClasses.mark} {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background-color: currentColor;
    top: 5px;
    opacity: 0.7;
    transform: translateX(-50%);
    :hover{
      transform: scale(1.5) translateX(-50%);
    }
  }

  & .${sliderUnstyledClasses.markLabel}{
    display: none;
  }

  & .${sliderUnstyledClasses.valueLabel} {
    font-family: IBM Plex Sans;
    font-size: 14px;
    display: block;
    position: relative;
    top: -1.6em;
    text-align: center;
    color: red;
  }
  `,
);
