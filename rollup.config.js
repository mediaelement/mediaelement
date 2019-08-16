export default [
    {
        input: 'src/mediaelement.js',
        output: {
            file: 'dist/umd.mediaelement.js',
            format: 'umd',
            name: 'mediaelement'
        }
    },
    {
        input: 'src/mediaelement-and-player.js',
        output: {
            file: 'dist/esm.mediaelement-and-player.js',
            format: 'esm'
        }
    }
]