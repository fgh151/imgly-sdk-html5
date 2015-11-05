/*
 * Photo Editor SDK - photoeditorsdk.com
 * Copyright (c) 2013-2015 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */

import Promise from '../vendor/promise'
import EventEmitter from './event-emitter'

export default class OperationsStack extends EventEmitter {
  constructor (operations = []) {
    super()

    this._onOperationUpdate = this._onOperationUpdate.bind(this)

    this._stack = operations
    this._stack.forEach((operation) => {
      operation.on('update', this._onOperationUpdate)
    })
  }

  /**
   * Clears this operations stack
   */
  clear () {
    this.forEach(operation =>
      this.remove(operation))
  }

  /**
   * Gets called when an operation is about to be updated
   * @param  {Operation} operation
   * @param  {Object} options
   * @private
   */
  _onOperationUpdate (operation, options) {
    this.emit('operation-update', operation, options)
  }

  /**
   * Passes Array#forEach
   * @param  {Function} iterator
   * @return {Array}
   */
  forEach (iterator) {
    return this._stack
      .filter((op) => !!op)
      .forEach(iterator)
  }

  /**
   * Renders all operations
   * @param  {Renderer} renderer
   * @return {Promise}
   */
  render (renderer) {
    const operations = this._stack
      .filter((op) => !!op)

    let promise = Promise.resolve()
    operations.forEach((operation) => {
      promise = promise.then(() => {
        return operation.render(renderer)
      })
    })

    return promise
  }

  /**
   * Validates the settings of all operations
   * @return {Promise}
   */
  validateSettings () {
    return Promise.all(
      this._stack
        .filter((op) => !!op)
        .map((op) => op.validateSettings())
    )
  }

  /**
   * Sets all operations to dirty
   */
  setAllToDirty () {
    this._stack.forEach((op) => op.setDirty(true))
  }

  /**
   * Finds the first dirty operation and sets all following operations
   * to dirty
   */
  updateDirtiness () {
    let dirtyFound = false
    for (let i = 0; i < this._stack.length; i++) {
      let operation = this._stack[i]
      if (!operation) continue
      if (operation.isDirty()) {
        dirtyFound = true
      }

      if (dirtyFound) {
        operation.setDirty(true)
      }
    }
  }

  /**
   * Adds the given operation to this stack
   * @return {Operation}
   */
  push (operation) {
    this._stack.push(operation)
  }

  /**
   * Returns a cloned instance of this stack
   * @return {OperationsStack}
   */
  clone () {
    return new OperationsStack(this._stack.slice(0))
  }

  /**
   * Returns the operation at the given index
   * @param  {Number} index
   * @return {operation}
   */
  get (index) {
    return this._stack[index]
  }

  /**
   * Sets the operation at the given index to the given one
   * @param  {Number} index
   * @param  {Operation} operation
   */
  set (index, operation) {
    if (this._stack[index]) {
      this._stack[index].off('update', this._onOperationUpdate)
    }
    this._stack[index] = operation
    operation.on('update', this._onOperationUpdate)
  }

  /**
   * Removes the given operation
   * @param  {Operation} operation
   */
  remove (operation) {
    const index = this._stack.indexOf(operation)
    if (index === -1) return
    if (this._stack[index]) {
      this._stack[index].off('update', this._onOperationUpdate)
    }
    this._stack.splice(index, 1)
  }

  /**
   * Removes the operation at the given index
   * @param  {Number} index
   */
  removeAt (index) {
    if (this._stack[index]) {
      this._stack[index].off('update', this._onOperationUpdate)
    }
    this._stack.splice(index, 1)
  }

  /**
   * Returns the stack
   * @return {Array.<Operation>}
   */
  getStack () {
    return this._stack
  }
}

