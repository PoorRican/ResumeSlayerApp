import React, { FC } from "react";
import { HtmlRenderer, Parser } from "commonmark";

type MarkdownBlockProps = {
  text: string;
}

const MarkdownBlock: FC<MarkdownBlockProps> = ({ text }) => {

  let parser = new Parser()
  let renderer = new HtmlRenderer();

  let html = renderer.render(parser.parse(text))
  html = html.replace('\n', '');

  // Add the class 'text-2xl' to all occurrences of the <h2> tag in html
  html = html.replace(/<h1\b/g, '<h1 class="text-2xl pt-8"');  
  html = html.replace(/<h2\b/g, '<h1 class="text-xl pt-4 pb-2"');  
  html = html.replace(/<h3\b/g, '<h1 class="text-lg pt-2 pb-4"');  
  html = html.replace(/<h4\b/g, '<h1 class="text-md pt-8 pb-4"');  
  html = html.replace(/<ul\b/g, '<ul class="list-disc pl-2"');  
  html = html.replace(/<li\b/g, '<li class="list-disc"');  

  return <article dangerouslySetInnerHTML={{__html: html}}></article>;
}

export default MarkdownBlock;
