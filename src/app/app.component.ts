import { CommonModule } from '@angular/common';

import { RouterOutlet } from '@angular/router';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import 'prismjs';
import * as Prism from 'prismjs';
import 'prismjs/prism';
import 'prismjs/components/prism-java.min.js'; // Import Java syntax highlighting
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-tomorrow.css'; // Or any other theme
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ngEditor';
  paragraphColor = 'black';

  @ViewChild('result') result: ElementRef | undefined;
  @ViewChild('editorContent') editorContent!: ElementRef ;


  constructor(private sanitizer: DomSanitizer){
 }

ngAfterViewInit(){
    let content = '';
    const safeHtml = this.sanitizer.bypassSecurityTrustHtml(content);
    this.editorContent.nativeElement.innerHTML = safeHtml as string;
 
}

  execCommand(command: string) {
    document.execCommand(command, false, '');
  }

  updateContent() {
    // Update content whenever there's an input in the contenteditable div
    let c = document.querySelector('.editor-content')!.innerHTML;
    this.result!.nativeElement.innerHTML =this.sanitizer.bypassSecurityTrustHtml(c); 
  }


  changeTextColor(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    document.execCommand('foreColor', false, color);
  }

  insertCodeBlock() {
    const selection:any = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const codeBlock = `<pre><code class="language-java">${range.toString()}</code></pre>`;
  
      // Create a document fragment and insert the code block
      const div = document.createElement('div');
      div.innerHTML = codeBlock;
      const frag:any = document.createDocumentFragment();
  
      // Move the content of the div to the document fragment
      while (div.firstChild) {
        frag.appendChild(div.firstChild);
      }
  
      // Insert the code block at the caret position
      range.deleteContents();
      range.insertNode(frag);
  
      // Optionally, you can call Prism.highlightElement to highlight the new code block
      Prism.highlightElement(frag.firstChild.firstChild);
    }
  }

  _paragraphColor(event:Event){
    const color = (event.target as HTMLInputElement).value;
    this.paragraphColor = color;
  }

  insertColoredParagraph() {
    const selection:any = window.getSelection();
    const editor = document.querySelector('.editor-content') as HTMLElement;

    if (selection.rangeCount > 0 && this.isSelectionInEditable(selection, editor)) {
      const range = selection.getRangeAt(0);
      const coloredParagraph = `<div style="background-color: ${this.paragraphColor}; border-radius: 5px; padding: 10px; margin: 5px 0;">This is a colored paragraph.</div>`;
  
      const div = document.createElement('div');
      div.innerHTML = coloredParagraph;
      const frag = document.createDocumentFragment();
  
      while (div.firstChild) {
        frag.appendChild(div.firstChild);
      }
  
      range.deleteContents();
      range.insertNode(frag);
    }
  }

  isSelectionInEditable(selection: Selection, editableElement: HTMLElement): boolean {
    const selectedRange = selection.getRangeAt(0);
    return editableElement.contains(selectedRange.startContainer) && editableElement.contains(selectedRange.endContainer);
  }
}
