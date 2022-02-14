import { Injectable } from '@nestjs/common';
import { toXML } from 'jstoxml';

const xmlOptions = {
    header: false,
    indent: '  '
};

@Injectable()
export class XmlJsService {
    jsonToXML(name: string, json: any): XMLDocument {
        try {
            const content = [
                json.map((el) => this.createXmlElement({ name, content: el }))
            ];

            return toXML({
                _name: 'myRoot',
                _attrs: {
                  version: '2.0'
                },
                _content: content
              }, xmlOptions);
        } catch (err) {
            return null;
        }
    }

    createXmlElement({ name = null, content = {} } = {}) {
        if (!Array.isArray(content)) {
          content = [content];
        }
      
        return {
          _name: name,
          _content: content
        };
    }
}
