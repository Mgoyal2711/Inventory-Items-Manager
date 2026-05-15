FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY InventoryApi/InventoryApi.csproj InventoryApi/
RUN dotnet restore InventoryApi/InventoryApi.csproj
COPY InventoryApi/ InventoryApi/
RUN dotnet publish InventoryApi/InventoryApi.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "InventoryApi.dll"]
