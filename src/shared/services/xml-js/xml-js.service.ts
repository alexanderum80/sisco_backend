import { Injectable } from '@nestjs/common';
import { toXML } from 'jstoxml';

const xmlOptions = {
    header: false,
    indent: '  '
};

@Injectable()
export class XmlJsService {
    jsonToXML(_name: string, json: any): string {
        try {
            const content = [
                json.map((el: any) => this.createXmlElement({ name: _name, content: el }))
            ];

            return toXML({
                _name: 'myRoot',
                _attrs: {
                  version: '2.0'
                },
                _content: content
              }, xmlOptions);
        } catch (err: any) {
            return '';
        }
    }

    createXmlElement({ name = '', content = {} } = {}) {
        if (!Array.isArray(content)) {
          content = [content];
        }
      
        return {
          _name: name,
          _content: content
        };
    }
}
