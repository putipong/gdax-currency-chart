export default function( env ) {
    return require( `./webpack-config/webpack.${env}.config.js` );
}