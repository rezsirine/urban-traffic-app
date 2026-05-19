import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        buildService({ url }) {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }) {
              // Transmettre le token JWT aux sous-services
              request.http.headers.set(
                'authorization',
                context.req?.headers?.authorization || ''
              );
            },
          });
        },
        serviceList: [
          { name: 'auth',          url: process.env.AUTH_SERVICE_URL },
          { name: 'vehicles',      url: process.env.VEHICLE_SERVICE_URL },
          { name: 'traffic',       url: process.env.TRAFFIC_SERVICE_URL },
          { name: 'incidents',     url: process.env.INCIDENT_SERVICE_URL },
          { name: 'notifications', url: process.env.NOTIF_SERVICE_URL },
        ],
      },
      context: ({ req }) => ({ req }),
    }),
  ],
})
export class AppModule {}