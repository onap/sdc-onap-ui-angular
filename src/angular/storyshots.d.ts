// Ambient declaration for @storybook/addon-storyshots@4.0.0-alpha.9, which ships
// no bundled TypeScript typings. Only the members used by storyshots.spec.ts are
// declared. Picked up by tsconfig.jest.json (include: **/*.d.ts); not part of the
// AOT build (tsconfig-aot.json compiles only index.ts and its import graph).
declare module '@storybook/addon-storyshots' {
    export interface StoryshotsOptions {
        suite?: string;
        configPath?: string;
        test?: any;
        storyNameRegex?: RegExp;
        storyKindRegex?: RegExp;
    }
    export const renderOnly: any;
    export const snapshot: any;
    export const renderWithOptions: any;
    export default function initStoryshots(options?: StoryshotsOptions): void;
}
