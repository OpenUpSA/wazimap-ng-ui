const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
import Head from 'next/head';
import parse from 'html-react-parser';
import * as app from "../src/js/index.js";

export function getServerSideProps() {
  const html = fs.readFileSync("./pages/index.html", {encoding: 'utf8'});
  const dom = new JSDOM(html);
  const head = dom.window.document.getElementsByTagName("head");
  const body = dom.window.document.getElementsByTagName("body");

  return {props: {head: head[0].outerHTML, body: body[0].outerHTML}};
}

export default function HomePage({head, body}) {
  return (
    <div>
      <Head>
        {parse(head)}
      </Head>
      <div dangerouslySetInnerHTML={{__html: body}} />
    </div>
  );
}
