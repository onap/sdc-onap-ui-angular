import { TagCloudComponent } from './tag-cloud.component';

// TagCloudComponent manipulates its `list` array and emits on change; the logic
// is template-independent so it is exercised by direct instantiation.
describe('TagCloudComponent', () => {
    let component: TagCloudComponent;

    beforeEach(() => {
        component = new TagCloudComponent();
        component.list = ['a', 'b'];
    });

    it('adds a new, non-duplicate tag and emits the updated list', () => {
        let emitted: string[];
        component.listChanged.subscribe((list) => { emitted = list; });
        component.newTagItem = 'c';
        component.insertItemToList();
        expect(component.list).toEqual(['a', 'b', 'c']);
        expect(component.newTagItem).toEqual('');
        expect(emitted).toEqual(['a', 'b', 'c']);
    });

    it('flags a unique error and does not add a duplicate tag', () => {
        component.newTagItem = 'a';
        component.insertItemToList();
        expect(component.uniqueError).toEqual(true);
        expect(component.list).toEqual(['a', 'b']);
    });

    it('does not add an empty tag', () => {
        component.newTagItem = '';
        component.insertItemToList();
        expect(component.list).toEqual(['a', 'b']);
    });

    it('inserts the tag when Enter (keyCode 13) is pressed', () => {
        component.newTagItem = 'c';
        component.onKeyup({ keyCode: 13 });
        expect(component.list).toEqual(['a', 'b', 'c']);
    });

    it('ignores key presses other than Enter', () => {
        component.newTagItem = 'c';
        component.onKeyup({ keyCode: 65 });
        expect(component.list).toEqual(['a', 'b']);
    });
});
