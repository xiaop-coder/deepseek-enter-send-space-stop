// ==UserScript==
// @name         DeepSeek Enter Send Space Stop
// @namespace    https://chat.deepseek.com/
// @version      3.0
// @description  Enter sends messages. Space stops generation.
// @author       XiaoP
// @match        https://chat.deepseek.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const INSTALL_KEY = '__deepseek_enter_send_space_stop_cleanup__';
  if (typeof window[INSTALL_KEY] === 'function') {
    try { window[INSTALL_KEY](); } catch (_) {}
  }

  const controller = new AbortController();
  window[INSTALL_KEY] = () => controller.abort();

  const DEBUG = false;
  const LAST_ACTION_AT = new Map();

  function log(...args) {
    if (DEBUG) console.log('[DeepSeek hotkeys]', ...args);
  }

  function isEditable(el) {
    if (!el) return false;
    if (el.isContentEditable) return true;
    const tag = el.tagName ? el.tagName.toLowerCase() : '';
    return tag === 'textarea' || tag === 'input';
  }

  function getEventEditable(target) {
    if (isEditable(target)) return target;
    return target?.closest?.('textarea, input, [contenteditable="true"], [contenteditable="plaintext-only"]') || null;
  }

  function getMainInput() {
    const active = document.activeElement;
    if (isEditable(active)) return active;

    return document.querySelector('textarea[placeholder*="DeepSeek"], textarea[name="search"]')
      || document.querySelector('textarea, [contenteditable="true"], [contenteditable="plaintext-only"]');
  }

  function getText(el) {
    if (!el) return '';
    if ('value' in el) return el.value || '';
    return el.innerText || el.textContent || '';
  }

  function textOf(el) {
    return (el?.innerText || el?.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function isDisabled(el) {
    if (!el) return true;
    return el.disabled
      || el.getAttribute('aria-disabled') === 'true'
      || /\bds-button--disabled\b/.test(el.getAttribute('class') || '');
  }

  function isVisible(el) {
    if (!el || !(el instanceof HTMLElement)) return false;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0
      && rect.height > 0
      && style.display !== 'none'
      && style.visibility !== 'hidden'
      && style.pointerEvents !== 'none';
  }

  function findComposer(input) {
    return input?.closest?.('form, ._77cefa5, .aaff8b8f, [class*="composer"], [class*="Composer"]') || document;
  }

  function findPrimaryComposerButton(input) {
    const root = findComposer(input);
    return root.querySelector(
      '[role="button"].ds-button--primary.ds-button--filled, button.ds-button--primary.ds-button--filled, .ds-button--primary.ds-button--filled'
    );
  }

  function pathData(button) {
    return [...(button?.querySelectorAll?.('path') || [])]
      .map((path) => path.getAttribute('d') || '')
      .join(' ');
  }

  function findSendButton(input) {
    const primary = findPrimaryComposerButton(input);
    if (primary && !isDisabled(primary) && isVisible(primary)) return primary;

    const root = findComposer(input);
    return [...root.querySelectorAll('button, [role="button"], .ds-button')]
      .filter((button) => !isDisabled(button))
      .filter(isVisible)
      .sort((a, b) => b.getBoundingClientRect().right - a.getBoundingClientRect().right)[0] || null;
  }

  function findStopButton(input) {
    const stopText = /\u505c\u6b62|stop|cancel/i;
    const primary = findPrimaryComposerButton(input);
    if (primary && !isDisabled(primary) && isVisible(primary)) {
      const primaryText = textOf(primary);
      const primaryPath = pathData(primary);
      if (stopText.test(primaryText) || primaryPath.includes('M2 4.88')) return primary;
    }

    return [...document.querySelectorAll('button, [role="button"], .ds-button')]
      .filter((button) => !isDisabled(button))
      .filter(isVisible)
      .find((button) => stopText.test(textOf(button)) || pathData(button).includes('M2 4.88')) || null;
  }

  function clickOnce(button) {
    if (!button) return false;
    try { button.focus?.(); } catch (_) {}
    try { button.click?.(); } catch (_) {}
    return true;
  }

  function swallow(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  function runOnce(action, cooldownMs, fn) {
    const now = Date.now();
    const last = LAST_ACTION_AT.get(action) || 0;
    if (now - last < cooldownMs) {
      log('skip repeated action', action, now - last);
      return false;
    }

    LAST_ACTION_AT.set(action, now);
    fn();
    return true;
  }

  function handleKeydown(event) {
    if (event.isComposing || event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;

    const input = getEventEditable(event.target) || getMainInput();

    if ((event.key === ' ' || event.code === 'Space') && !event.shiftKey) {
      const stopButton = findStopButton(input);
      if (!stopButton) return;

      swallow(event);
      runOnce('stop', 700, () => clickOnce(stopButton));
      return;
    }

    if (event.key !== 'Enter' && event.code !== 'Enter' && event.code !== 'NumpadEnter') return;
    if (event.shiftKey) return;

    if (!input || !getText(input).trim()) return;

    const sendButton = findSendButton(input);
    if (!sendButton) return;

    swallow(event);
    runOnce('send', 1000, () => clickOnce(sendButton));
  }

  window.addEventListener('keydown', handleKeydown, { capture: true, signal: controller.signal });
  document.addEventListener('keydown', handleKeydown, { capture: true, signal: controller.signal });
})();
