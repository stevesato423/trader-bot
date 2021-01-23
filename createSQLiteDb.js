const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fs = require('fs');

createSQLiteDb();

async function createSQLiteDb() {

    console.log('starting db initialization');

    if(!fs.existsSync('./trader.db')) {
        // create trader database
        const traderDb = await open({
            filename: './trader.db',
            driver: sqlite3.cached.Database
        });
        // create credentials table
        await traderDb.run(`
            CREATE TABLE "credentials" (
                "id"	INTEGER NOT NULL CHECK(id=1),
                "credentials"	TEXT NOT NULL,
                PRIMARY KEY("id" AUTOINCREMENT)
            );
        `);
        // create strategies table
        await traderDb.run(`
            CREATE TABLE "strategies" (
                "id"	INTEGER NOT NULL,
                "name"	TEXT NOT NULL UNIQUE,
                PRIMARY KEY("id" AUTOINCREMENT)
            );
        `);
        // add initial strategy
        await traderDb.run(`
            INSERT INTO strategies (id, name) VALUES (1, 'reverse_stock_arbitrage');
        `);

        await traderDb.close();

        console.log('sucessfully initialized trader database');
    }

    if(!fs.existsSync('./twitter.db')) {
        // create twitter db
        const twitterDb = await open({
            filename: './twitter.db',
            driver: sqlite3.cached.Database
        });
        // create tweets table
        await twitterDb.run(`
            CREATE TABLE "tweets" (
                "id"	TEXT NOT NULL UNIQUE,
                "author_id"	TEXT NOT NULL,
                "created_at"	TIMESTAMP NOT NULL,
                "text"	TEXT NOT NULL,
                "entities"	TEXT,
                "public_metrics"	TEXT,
                "context_annotations"	TEXT,
                "withheld"	TEXT,
                "geo"	TEXT,
                PRIMARY KEY("id")
            );
        `);

        await twitterDb.run(`
            CREATE TABLE "following" (
                "id"	TEXT NOT NULL,
                "name"	TEXT NOT NULL,
                "username"	TEXT NOT NULL,
                PRIMARY KEY("id")
            );
        `);

        // TODO: remove this data insert after user has ability to configure this
        await twitterDb.run(`
            INSERT INTO "following"
            VALUES
            ('44196397', 'Elon Musk', 'elonmusk'),
            ('1332370385921306631', 'Reverse Split Arbitrage', 'ReverseSplitArb'),
            ('898021206967951360', 'Tesla Daily', 'TeslaPodcast');
        `);

        await twitterDb.close();

        console.log('sucessfully initialized twitter database');
    }

    console.log('All SQLite database files exist, if you are having problems, try "rm *.db && npm run postinstall".')
}