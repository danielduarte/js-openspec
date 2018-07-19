import assert from 'assert';

import SpecLibrary          from '../../../src/OpenSpec/SpecLibrary';
import SpecBuilder          from '../../../src/OpenSpec/SpecBuilder';
import SpecLibraryException from '../../../src/OpenSpec/SpecLibraryException';
import ParseSpecException   from '../../../src/OpenSpec/ParseSpecException';


describe('SpecLibraryTest', function() {

    it('testRegisterSpec', function() {

        let library = new SpecLibrary();
        let specName = 'TestSpec';
        let spec = SpecBuilder.getInstance().build({ type: 'string' }, library);

        assert(!library.hasSpec(specName));

        library.registerSpec(specName, spec);

        assert(library.hasSpec(specName));

    });

    it('testDuplicatedRegisterSpec', function() {

        let library = new SpecLibrary();
        let specName = 'TestSpec';
        let spec = SpecBuilder.getInstance().build({ type: 'string' }, library);

        assert.throws(function() {
            library.registerSpec(specName, spec);
            library.registerSpec(specName, spec);
        }, function(err) {
            if (err instanceof SpecLibraryException) {
                return true;
            }
        }, "Unexpected error");

    });

    it('testRegisterSpecFromData', function() {

        let library = new SpecLibrary();
        let specName = 'TestSpecFromData';
        let specData = { type: 'string' };

        assert(!library.hasSpec(specName));

        library.registerSpecFromData(specName, specData);

        assert(library.hasSpec(specName));
    
    });

    it('testTryRegisterInvalidSpecFromData', function() {

        let library = new SpecLibrary();
        let specName = 'TestInvalidSpecFromData';
        let specData = { type: 'hello' };

        assert.throws(function() {
            library.registerSpecFromData(specName, specData);
        }, function(err) {
            if (err instanceof ParseSpecException) {
                return true;
            }
        }, "Unexpected error");

        assert(!library.hasSpec(specName));
    });


    it('testUnregisterSpec', function() {

        let library = new SpecLibrary();
        let specName = 'TestSpecToUnregister';
        let spec = SpecBuilder.getInstance().build({ type: 'string' }, library);

        library.registerSpec(specName, spec);
        library.unregisterSpec(specName);

        assert(!library.hasSpec(specName));
    });

    it('testUnregisterNotRegisteredSpec', function() {

        let library = new SpecLibrary();
        let specName = 'TestUnregisteredSpec';

        assert.throws(function() {
            library.unregisterSpec(specName);
        }, function(err) {
            if (err instanceof SpecLibraryException) {
                return true;
            }
        }, "Unexpected error");
    });

    it('testReturnUnregisteredSpec', function() {

        let library = new SpecLibrary();
        let specName = 'TestSpecToUnregisterAndReturn';
        let spec = SpecBuilder.getInstance().build({ type: 'string' }, library);

        library.registerSpec(specName, spec);
        let unregisteredSpec = library.unregisterSpec(specName);

        assert(spec === unregisteredSpec);
    });

    it('testUnregisterAllSpecs', function() {
        let library = new SpecLibrary();

        library.registerSpecFromData('Spec1', { type: 'string' });
        library.registerSpecFromData('Spec2', { type: 'string' });
        library.registerSpecFromData('Spec3', { type: 'string' });

        assert(library.getSpecsCount() > 0);

        library.unregisterAll();

        assert(library.getSpecsCount() === 0);
    });

});
