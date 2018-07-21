//import Spec from 'OpenSpec\Spec\Spec';
// @todo finish this conversion to JS
import SpecLibraryException from './SpecLibraryException';
import SpecBuilder          from './SpecBuilder';


class SpecLibrary
{
    constructor() {
        this._specs = [];
    }
    
    hasSpec(name)
    {
        return this._specs.hasOwnProperty(name);
    }

    registerSpec(name, spec)
    {
        if (this.hasSpec(name)) {
            throw new SpecLibraryException();
        }

        this._specs[name] = spec;

        return this;
    }

    registerSpecFromData(name, specData)
    {
        let spec = SpecBuilder.getInstance().build(specData, this);

        return this.registerSpec(name, spec);
    }

    unregisterSpec(name)
    {
        if (!this.hasSpec(name)) {
            throw new SpecLibraryException();
        }

        let spec = this._specs[name];
        delete this._specs[name];

        return spec;
    }

    // @todo check if this method is useful
    getSpecsCount()
    {
        return Object.keys(this._specs).length
    }

    unregisterAll()
    {
        this._specs = [];
    }

    getSpec(name)
    {
        if (!this.hasSpec(name)) {
            throw new SpecLibraryException();
        }

        return this._specs[name];
    }
/*
    validateValue(specName, value)
    {
        errors = this.validateValueGetErrors(specName, value);

        return count(errors) === 0;
    }

    validateValueGetErrors(specName, value)
    {
        try {
            this.getSpec(specName).parse(value);
        } catch (ex) {
            if (ex instanceof ParseSpecException) {
                return ex.getErrors();
            }
            throw ex;
        }

        return [];
    }*/
}

export default SpecLibrary;
