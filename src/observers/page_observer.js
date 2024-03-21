import { visible } from "helpers"

export default class PageObserver {
  mutationObserver = new MutationObserver((mutations) => this.pageChanged(mutations))

  constructor(controller) {
    this.controller = controller
  }

  start() {
    if (this.started) return

    this.mutationObserver.observe(document.body, { childList: true, subtree: true, attributes: true })
    this.started = true
  }

  stop() {
    if (!this.started) return

    this.mutationObserver.disconnect()
    this.started = false
  }

  pageChanged(mutations) {
    if (this.shouldReleaseFocus()) return this.controller.releaseFocus()

    this.controller.captureFocus()
    if (this.areChangesOutsideElement(mutations)) this.controller.makeOutsideElementsInert()
  }

  shouldReleaseFocus() {
    return !this.element.isConnected || !visible(this.element)
  }

  areChangesOutsideElement(mutations) {
    return mutations.some(({ target }) => !this.element.contains(target))
  }

  get element() {
    return this.controller.element
  }
}
