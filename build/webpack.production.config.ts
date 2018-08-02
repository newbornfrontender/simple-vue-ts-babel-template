'use strict';

// -----------------------------------------------------------------------------

import { Configuration, EnvironmentPlugin, DefinePlugin } from 'webpack';
import { resolve } from 'path';

// -----------------------------------------------------------------------------

import WebpackMerge from 'webpack-merge';

// -----------------------------------------------------------------------------

import WebpackDotenvPlugin from 'webpack-dotenv-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

// -----------------------------------------------------------------------------

declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'none';
    HASH_DIGEST: 'hex' | 'latin1' | 'base64';
    HASH_DIGEST_LENGTH: string;
  };
};

// -----------------------------------------------------------------------------

const config: Configuration = WebpackMerge({
  plugins: [
    new WebpackDotenvPlugin({
      encoding: 'utf-8',
      sample: resolve(__dirname, '../.env/default'),
      path: resolve(__dirname, '../.env/production'),
      allowEmptyValues: false,
      silent: false,
    }),
  ],
}, {
  mode: 'production',
  resolve: {
    extensions: [ '.ts', '.tsx', '.hbs', '.vue' ],
  },
  entry: {
    index: resolve(__dirname, '../src/index.ts'),
  },
  output: {
    path: resolve(__dirname, '../dist'),
    filename: 'js/[name].[contenthash].js',
    hashDigest: process.env.HASH_DIGEST,
    hashDigestLength: Number(process.env.HASH_DIGEST_LENGTH),
  },
  module: {
    rules: [{
      test: /\.vue$/,
      use: [{
        loader: 'vue-loader',
        options: {
          loaders: {
            ts: 'ts-loader',
            tsx: 'babel-loader!ts-loader',
          },
        },
      }],
    }, {
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [{
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [ /TS\.vue$/ ],
        },
      }],
    }, {
      test: /\.tsx$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader!ts-loader',
        options: {
          appendTsxSuffixTo: [ /TSX\.vue$/ ],
        },
      }],
    }, {
      test: /\.hbs$/,
      exclude: /node_modules/,
      use: [{
        loader: 'handlebars-loader',
      }],
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
        },
      ],
    }],
  },
  plugins: [
    new EnvironmentPlugin([
      'NODE_ENV',
      'HASH_DIGEST',
      'HASH_DIGEST_LENGTH',
    ]),
    // new DefinePlugin({
    //   'process.env': {
    //     'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    //     'HASH_DIGEST': JSON.stringify(process.env.HASH_DIGEST),
    //     'HASH_DIGEST_LENGTH': JSON.stringify(process.env.HASH_DIGEST_LENGTH),
    //   },
    // }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '../public/index.hbs'),
      filename: 'index.html',
      title: 'Simple Vue TypeScript Babel template',
      meta: {
        charset: 'UTF-8',
        viewport: 'width=device-width, initial-scale=1.0',
      },
      inject: true,
      hash: false,
      minify: {
        removeComments: false,
        collapseWhitespace: false,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[name].[contenthash].css',
    }),
  ],
});

// -----------------------------------------------------------------------------

export default config;
