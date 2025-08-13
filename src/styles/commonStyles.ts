import { css } from "@linaria/atomic";
import { mq } from "./breakpoints";
import { TEXT_COLOR, TITLE_COLOR } from "./colors";

export const FlexColumn = css`
  display: flex;
  flex-direction: column;
`;

export const FlexRow = css`
  display: flex;
  flex-direction: row;
`;

export const FlexBetweenCenter = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FlexCenter = css`
  display: flex;
  align-items: center;
`;

export const fontSizeStyles = css`
  font-size:0.875rem;

  ${mq[0]} {  
    font-size:1.063rem;
  }
`;

export const errorTextStyles = css`
  color:#dc233d;
  font-size: 0.7rem;
  font-weight: 500;
  margin-left: 0.4rem;
  bottom: -0.938rem;
  position:absolute;
  ${mq[0]} {
  bottom: -0.938rem;
    font-size: 0.8rem;
  }
`;

export const TextStyles = css`
  font-size: 0.813rem;
  color: ${TEXT_COLOR};

  ${mq[0]} {
    font-size: 0.938rem;
  }
`;

export const TitleStyles = css`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${TITLE_COLOR};

  ${mq[0]} {
    font-size: 1.25rem;
  }
`;