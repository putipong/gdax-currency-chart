/**
 * Created by mattputipong on 10/2/17.
 */

import Gdax from 'gdax';
import moment from 'moment';
import _ from 'lodash';
import * as d3 from 'd3';
import * as fc from 'd3fc';

class API {
    constructor() {
        this.pubClient = new Gdax.PublicClient( 'LTC-USD' );
    }

    getProductHistoryRates() {
        return new Promise( ( res, rej ) => {
            const now = new Date();
            const then = new Date();

            now.setSeconds( now.getSeconds() - 6 );
            then.setHours( then.getHours() - 1 );

            const params = {
                start: then.toISOString(),
                end: now.toISOString(),
                granularity: 60
            };

            this.pubClient.getProductHistoricRates( params, ( err, data ) => {
                const body = JSON.parse( data.body );
                console.log( body );

                const parsed = _.reduce( body, ( arr, row ) => {
                    const obj = {
                        open: row[ 3 ],
                        close: row[ 4 ],
                        high: row[ 2 ],
                        low: row[ 1 ],
                        date: this.parseTime( row[ 0 ] )
                    };

                    arr.push( obj );

                    return arr;
                }, [] );

                res( parsed );
            } );
        } );
    }

    chart( data ) {
        const candlestickSeries = fc.seriesSvgCandlestick()
            .bandwidth( 4 );

        const chart = fc.chartSvgCartesian( d3.scaleTime(), d3.scaleLinear() )
            .plotArea( candlestickSeries );

        const xExtent = fc.extentDate()
            .accessors( [ d => d.date ] )
            .pad( [ 0.01, 0.05 ] );

        const yExtent = fc.extentLinear()
            .accessors( [ d => d.high, d => d.low ] )
            .pad( [ 0.1, 0.1 ] );

        chart.xDomain( xExtent( data ) )
            .yDomain( yExtent( data ) );

        d3.select( '#candle-chart' )
            .datum( data )
            .call( chart );
    }

    parseTime( time ) {
        const ISO = moment( time, 'X' ).toISOString();
        const parseDate = d3.timeParse( '%Y-%m-%dT%H:%M:%S.%LZ');

        return parseDate( ISO );
    }
}

const api = new API();

api.getProductHistoryRates()
    .then( rates => api.chart( rates ) );

export default API;