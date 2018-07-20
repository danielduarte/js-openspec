import ObjectSpec from "./Spec/Type/ObjectSpec";
import ParseSpecException from "./ParseSpecException";


class Entity
{

    constructor(spec, data)
    {
        // @todo check if this validation should be here
//        $errors = $spec->validate($data);
//        if (count($errors) > 0) {
//            throw new \GenericEntity\SpecException('Not valid data for the specification.', $errors);
//        }

        this._spec = spec;
        this._data = data;

        return new Proxy(this, this);
    }
/*
    public function getData()
    {
        return $this->_data;
    }
*/

    get(instance, prop) { // @todo check the proxy method "apply" instead of using get

        if (Object.getPrototypeOf(instance).hasOwnProperty(prop)) {
            return instance[prop];
        }

        // Check if it is a valid getter name
        let matches = prop.match(/^get([A-Z_0-9][a-zA-Z_0-9]*)$/);
        if (matches === null || matches.length < 2) {
            return undefined;
        }

        // @todo check what happens with fields that started originally with uppercase
        let fieldName = matches[1];
        fieldName = fieldName.charAt(0).toLowerCase() + fieldName.slice(1); // lcfirst

        let fieldValue = this.getFieldData(fieldName);
        return function () { return fieldValue; };
    }

    getFieldData(fieldName)
    {
        if (!this.isValidFieldName(fieldName)) {
            throw new Error(`Field ${fieldName} not exists.`);
        }

        if (this._data.hasOwnProperty(fieldName)) {
            return this._data[fieldName];
        }

        // @todo Add support to define default values by field (in ObjectSpec)
        return null; // Default value for valid fields
    }

    isValidFieldName(fieldName)
    {
        return this._spec.isValidFieldName(fieldName);
    }
}


export default Entity;
