import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { DefaultProps, Selectors, useComponentDefaultProps } from '@mantine/styles';
import { Anchor } from '../Anchor';
import { Box } from '../Box';
import useStyles, { SpoilerStylesParams } from './Spoiler.styles';

export type SpoilerStylesNames = Selectors<typeof useStyles>;

export interface SpoilerProps
  extends DefaultProps<SpoilerStylesNames, SpoilerStylesParams>,
    React.ComponentPropsWithoutRef<'div'> {
  /** Max height of visible content, when this point is reached spoiler appears */
  maxHeight: number;

  /** Label for close spoiler action */
  hideLabel: React.ReactNode;

  /** Label for open spoiler action */
  showLabel: React.ReactNode;

  /** Get ref of spoiler toggle button */
  controlRef?: React.ForwardedRef<HTMLButtonElement>;

  /** Initial spoiler state, true to wrap content in spoiler, false to show content without spoiler, opened state will be updated on mount */
  initialState?: boolean;

  /** Spoiler reveal transition duration in ms, 0 or null to turn off animation */
  transitionDuration?: number;
}

const defaultProps: Partial<SpoilerProps> = {
  maxHeight: 100,
  transitionDuration: 200,
  initialState: false,
};

export const Spoiler = forwardRef<HTMLDivElement, SpoilerProps>((props, ref) => {
  const {
    className,
    children,
    maxHeight,
    hideLabel,
    showLabel,
    transitionDuration,
    controlRef,
    initialState,
    classNames,
    styles,
    unstyled,
    ...others
  } = useComponentDefaultProps('Spoiler', defaultProps, props);

  const { classes, cx } = useStyles(
    { transitionDuration },
    { classNames, styles, unstyled, name: 'Spoiler' }
  );

  const [show, setShowState] = useState(initialState);
  const [spoiler, setSpoilerState] = useState(initialState);
  const contentRef = useRef<HTMLDivElement>(null);

  const spoilerMoreContent = show ? hideLabel : showLabel;

  useEffect(() => {
    setSpoilerState(maxHeight < contentRef.current.clientHeight);
  }, [maxHeight, children]);

  return (
    <Box className={cx(classes.root, className)} ref={ref} {...others}>
      <div
        className={classes.content}
        style={{
          maxHeight: !show ? maxHeight : contentRef.current && contentRef.current.clientHeight,
        }}
      >
        <div ref={contentRef}>{children}</div>
      </div>

      {spoiler && (
        <Anchor
          component="button"
          ref={controlRef}
          onClick={() => setShowState((opened) => !opened)}
          className={classes.control}
        >
          {spoilerMoreContent}
        </Anchor>
      )}
    </Box>
  );
});

Spoiler.displayName = '@mantine/core/Spoiler';
