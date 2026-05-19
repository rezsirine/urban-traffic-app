import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'auth', url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001/graphql' },
            { name: 'vehicles', url: process.env.VEHICLE_SERVICE_URL || 'http://localhost:3002/graphql' },
            { name: 'traffic', url: process.env.TRAFFIC_SERVICE_URL || 'http://localhost:3003/graphql' },
            { name: 'incidents', url: process.env.INCIDENT_SERVICE_URL || 'http://localhost:3004/graphql' },
            { name: 'notifications', url: process.env.NOTIF_SERVICE_URL || 'http://localhost:3005/graphql' },
          ],
        }),
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}