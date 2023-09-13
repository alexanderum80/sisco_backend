import { Injectable } from '@nestjs/common';
import { toXML } from 'jstoxml';

const xmlOptions = {
  header: false,
  indent: '  ',
};

@Injectable()
export class XmlJsService {
  jsonToXML(_name: string, json: any): string {
    try {
      const content = [json.map((el: any) => this.createXmlElement({ name: _name, content: el }))];

      const xml = toXML(
        {
          _name: 'myRoot',
          _attrs: {
            version: '2.0',
          },
          _content: content,
        },
        xmlOptions,
      );

      return xml
        .replace(/&nbsp;/gi, '')
        .replace(/&#x/gi, '_')
        .replace(/&amp;/gi, ' and ')
        .replace(/&quot;/gi, "''")
        .replace(/&gt/gi, '')
        .replace(/&lt/gi, '');
    } catch (err: any) {
      return '';
    }
  }

  private createXmlElement({ name = '', content = {} } = {}) {
    if (!Array.isArray(content)) {
      content = [content];
    }

    return {
      _name: name,
      _content: content,
    };
  }
}
