import { css, cx } from "@linaria/atomic"
import { GiSplash } from "react-icons/gi"
import { IoClose } from "react-icons/io5"
import { TiTick } from "react-icons/ti"
import { FaXmark } from "react-icons/fa6"
import {
  DANGER_BACKGROUND,
  DANGER_COMPLIMENT,
  SUCCESS_BACKGROUND,
  SUCCESS_COMPLIMENT,
} from "../../styles/colors"
import {
  FlexCenter,
  FlexColumn,
  TextStyles,
  TitleStyles,
} from "../../styles/commonStyles"
import { mq } from "../../styles/breakpoints"

const ToastContainerStyles = css`
  position: relative;
  width: 80%;
  min-height: 3.75rem;
  border-radius: 1.25rem;
  background-color: ${SUCCESS_BACKGROUND};
  padding: 0.75rem;

  ${mq[0]} {
    min-height: 4.5rem;
  }
`

const ToastIconContainer = css`
  position: absolute;
  left: 1.25rem;
  top: -1.15rem;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  color: white;
  justify-content: center;
`

const ToastIcon = css`
  font-size: 1.75rem;
`

const ToastMessageContainer = css`
  position: absolute;
  left: 25%;
  top: 50%;
  transform: translateY(-50%);
  gap: 0.3rem;
`

const ToastTitle = css`
  color: rgba(255, 255, 255, 0.9);
`

const ToastMessage = css`
  color: rgba(255, 255, 255, 0.8);
  max-width: 12.5rem;
  line-height: 0.95;
`

const ToastCloseIconContainer = css`
  position: absolute;
  top: 0.3rem;
  right: 0.5rem;
  cursor: pointer;
`

const ToastCloseIcon = css`
  font-size: 1.25rem;
`

const ToastSplashContainer = css`
  position: absolute;
  bottom: 0;
  left: 0;
`

const ToastSplash = css`
  font-size: 2rem;
`

const ContainerStyles = css`
  justify-items: center;
  align-items: center;
  gap: 1.25rem;
  position: absolute;
  top: 1rem;
  right: 0;
  max-width: 28.75rem;
  max-height: 90vh;
  overflow-y: hidden;
  padding: 1.125rem 1rem 1rem 1rem;
  width: 100%;
  z-index: 1000;

  ${mq[0]} {
    max-width: 28.75rem;
    top: 3rem;
    right: 40%;
    transform: translateX(40%);
    padding: 1.25rem 1rem 1rem 1rem;
  }
`

export type Message = {
  id: string
  message: string
  type: "error" | "success" | "information" | "warning"
}

type Props = {
  message: Message
  onRemove: (index: number) => void
  index: number
  isSuccess?: boolean
}

const Toast = ({ message, onRemove, index, isSuccess = false }: Props) => (
  <div className={cx(FlexColumn, ContainerStyles)}>
    <div
      className={ToastContainerStyles}
      style={{ background: isSuccess ? SUCCESS_BACKGROUND : DANGER_BACKGROUND }}
    >
      <div
        className={cx(FlexCenter, ToastIconContainer)}
        style={{
          background: isSuccess ? SUCCESS_COMPLIMENT : DANGER_COMPLIMENT,
        }}
      >
        {isSuccess ? (
          <TiTick className={ToastIcon} />
        ) : (
          <FaXmark className={ToastIcon} />
        )}
      </div>

      <div className={cx(FlexColumn, ToastMessageContainer)}>
        <h4 className={cx(TitleStyles, ToastTitle)}>
          {isSuccess ? "Successful!" : "Oh Snap!"}
        </h4>
        <p className={cx(TextStyles, ToastMessage)}>{message.message}</p>
      </div>

      <div className={cx(FlexCenter, ToastSplashContainer)}>
        <GiSplash
          className={ToastSplash}
          style={{ color: isSuccess ? SUCCESS_COMPLIMENT : DANGER_COMPLIMENT }}
        />
      </div>

      <div className={cx(FlexCenter, ToastCloseIconContainer)}>
        <IoClose
          className={ToastCloseIcon}
          onClick={() => onRemove(index)}
          style={{ color: isSuccess ? SUCCESS_COMPLIMENT : DANGER_COMPLIMENT }}
        />
      </div>
    </div>
  </div>
)

export default Toast