import { css, cx } from "@linaria/atomic";
import { type FC } from "react";
import { mq } from "../styles/breakpoints";
import { DARK_THEME_COLOR } from "../styles/colors";
import { FlexColumn } from "../styles/commonStyles";

type LoadingProps = {
  centerOnFullWidthScreen?: boolean;
};

const loaderBase = css`
  border-style: solid;
  animation: spin 2s linear infinite;
  position: relative;
  border-radius: 50%;
  top: 0.3rem;
  width: 4rem;
  height: 4rem;
  border-width: 0.5rem;
  border-color: ${DARK_THEME_COLOR} #eee #eee;

  ${mq[0]} {
    width: 3.2rem;
    height: 3.2rem;
    border-width: 0.2rem;
  }
`;

const spinAnimation = css`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingWaitText = css`
  text-transform: uppercase;
  font-size: 0.625rem;
  color: ${DARK_THEME_COLOR};

  ${mq[0]} {
    font-size: 0.75rem;
  }
`;

const LoadingInfoText = css`
  color: ${DARK_THEME_COLOR};
`;

const TextsContainer = css`
  gap: 0.25rem;
  align-items: center;
`;

const LoadingWrapper = css`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const centeredTransform = css`
  ${mq[0]} {
    transform: translate(-50%, -50%);
  }
`;

const offCenterTransform = css`
  ${mq[0]} {
    transform: translate(100%, -50%);
  }
`;

const Gap1 = css`
  gap: 1rem;
`;

const Loader: FC<LoadingProps> = ({ centerOnFullWidthScreen = false }) => (
  <div
    className={cx(
      FlexColumn,
      Gap1,
      LoadingWrapper,
      !centerOnFullWidthScreen ? offCenterTransform : centeredTransform
    )}
  >
    <div className={cx(loaderBase, spinAnimation)} />
    <div className={cx(FlexColumn, TextsContainer)}>
      <span className={LoadingWaitText}>PLEASE WAIT</span>
      <h3 className={LoadingInfoText}>Just a Sec</h3>
    </div>
  </div>
);

export default Loader;