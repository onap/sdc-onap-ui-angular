import { storiesOf } from '@storybook/angular';
import { withKnobs, text, number, boolean, array, select, color, date, button } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { action, configureActions } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { SearchBarComponent, InputComponent } from '../../src/angular/components';
import { FormElementsModule } from '../../src/angular/form-elements/form-elements.module';

storiesOf('Form elements|Searchbar', module)
  .addDecorator(withKnobs)
  .addDecorator(withNotes)
  .addDecorator(
    moduleMetadata({
      declarations: [
        SearchBarComponent
      ],
      imports: [
          FormElementsModule
      ]
    })
  )
  .add('Searchbar', () => {
      const _label = text('label', 'Searchbar label');
      const _placeholder = text('placeholder', 'Searchbar placeholder');
      const _debounceTime = number('debounceTime', 200);
      const _searchQuery = text('searchQuery', '');
      const _searchQueryClick = text('*(searchQueryClick)', 'Event throws when click on search query, see in Action logger tab.');

      return {
        props: {
            onChange: action('click on search query'),
            _label, _searchQuery, _placeholder, _debounceTime
        },
        template: `
        <sdc-search-bar
            [placeholder]="_placeholder"
            [label]="_label"
            [debounceTime]="_debounceTime"
            [(searchQuery)]="_searchQuery"
            (searchQueryClick)="onChange($event)">
        </sdc-search-bar>
        `
      }
    },
    { notes: `<h2>Searchrbar</h2>
            The search bar component text is updated (after debounce time, default 200 miliseconds) while user write something.
            Use the KNOBS tab to change values.`
    }
)
