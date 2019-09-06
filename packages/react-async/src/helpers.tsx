import React from "react"
import propTypes from "./propTypes"

import {
  InitialChildren,
  PendingChildren,
  FulfilledChildren,
  RejectedChildren,
  SettledChildren,
  AsyncState,
} from "./Async"

// these were exported as type, but never existed
// export declare function IfLoading<T>(props: {
//   children?: PendingChildren<T>
//   initial?: boolean
//   state: AsyncState<T>
// }): React.ReactNode
// export declare function IfResolved<T>(props: {
//   children?: FulfilledChildren<T>
//   persist?: boolean
//   state: AsyncState<T>
// }): React.ReactNode

const nullify = <T extends {}>(children: T | undefined): T | null =>
  children === undefined ? null : children

const renderFn = (
  children: React.ReactNode | ((...args: any[]) => React.ReactNode),
  ...args: any[]
) => nullify(typeof children === "function" ? (children as any)(...args) : children)

/**
 * Renders only when no promise has started or completed yet.
 *
 * @prop {Function|Node} children Function (passing state) or React node
 * @prop {Object} state React Async state object
 * @prop {boolean} persist Show until we have data, even while pending (loading) or when an error occurred
 */
export const IfInitial = <T extends {}>({
  children,
  persist,
  state = {} as any,
}: {
  children?: InitialChildren<T>
  persist?: boolean
  state: AsyncState<T>
}) => <>{state.isInitial || (persist && !state.data) ? renderFn(children, state) : null}</>

/**
 * Renders only while pending (promise is loading).
 *
 * @prop {Function|Node} children Function (passing state) or React node
 * @prop {Object} state React Async state object
 * @prop {boolean} initial Show only on initial load (data is undefined)
 */
export const IfPending = <T extends {}>({
  children,
  initial,
  state = {} as any,
}: {
  children?: PendingChildren<T>
  initial?: boolean
  state: AsyncState<T>
}) => <>{state.isPending && (!initial || !state.value) ? renderFn(children, state) : null}</>

/**
 * Renders only when promise is resolved.
 *
 * @prop {Function|Node} children Function (passing data and state) or React node
 * @prop {Object} state React Async state object
 * @prop {boolean} persist Show old data while pending (promise is loading)
 */
export const IfFulfilled = <T extends {}>({
  children,
  persist,
  state = {} as any,
}: {
  children?: FulfilledChildren<T>
  persist?: boolean
  state: AsyncState<T>
}) => (
  <>{state.isFulfilled || (persist && state.data) ? renderFn(children, state.data, state) : null}</>
)

/**
 * Renders only when promise is rejected.
 *
 * @prop {Function|Node} children Function (passing error and state) or React node
 * @prop {Object} state React Async state object
 * @prop {boolean} persist Show old error while pending (promise is loading)
 */
export const IfRejected = <T extends {}>({
  children,
  persist,
  state = {} as any,
}: {
  children?: RejectedChildren<T>
  persist?: boolean
  state: AsyncState<T>
}) => (
  <>
    {state.isRejected || (persist && state.error) ? renderFn(children, state.error, state) : null}
  </>
)

/**
 * Renders only when promise is fulfilled or rejected.
 *
 * @prop {Function|Node} children Function (passing state) or React node
 * @prop {Object} state React Async state object
 * @prop {boolean} persist Show old data or error while pending (promise is loading)
 */
export const IfSettled = <T extends {}>({
  children,
  persist,
  state = {} as any,
}: {
  children?: SettledChildren<T>
  persist?: boolean
  state: AsyncState<T>
}) => <>{state.isSettled || (persist && state.value) ? renderFn(children, state) : null}</>

if (propTypes) {
  IfInitial.propTypes = propTypes.Initial
  IfPending.propTypes = propTypes.Pending
  IfFulfilled.propTypes = propTypes.Fulfilled
  IfRejected.propTypes = propTypes.Rejected
  IfSettled.propTypes = propTypes.Settled
}
