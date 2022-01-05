import { Injectable } from '@nestjs/common';
import { toXML } from 'jstoxml';

const xmlOptions = {
    header: false,
    indent: '  '
};

@Injectable()
export class XmlJsService {
    jsonToXML(json: any): XMLDocument {
        try {
            return toXML({
                _name: 'myRoot',
                _attrs: {
                  version: '2.0'
                },
                _content: json
              }, xmlOptions);
        } catch (err) {
            return null;
        }
    }
}
