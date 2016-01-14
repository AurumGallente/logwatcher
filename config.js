module.exports = {
            logfile: './error-dev.log',
            db:'',
            user: '',
            password: '',
            processPort: 3000,
            interval: 5000,
            config: {
            host: '',
            port: 5432,
            dialect: 'postgres',
                pool: {
                    max: 5,
                    min: 0,
                    idle: 10000
                }
            }
}