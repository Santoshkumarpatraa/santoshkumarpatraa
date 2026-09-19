import { Modal } from './Modal.js';
import { CONFIG } from './config.js';

export class ResumeViewer extends Modal {
    constructor(root, trigger) {
        super(root);
        this.frame = root.querySelector('#resume-frame');
        trigger.addEventListener('click', () => this.open());
    }

    onOpen() {
        this.frame.src = CONFIG.resumePath;
    }

    onClose() {
        this.frame.src = 'about:blank';
    }
}
