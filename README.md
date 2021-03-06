# IoTHub Device Simulator

Easy configurable IoTHub Device simulator that is deployed as Azure function.

* We will use the Azure CLI to create the resources and configure the message routing and define enrichment rules.

## Prerequisites

* You must have an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Install [Visual Studio Code](https://code.visualstudio.com/).

## Resources creation and configuration script
This script can ve executed in VS Code (any Powershell cmd with Azure CLI installed) or Azure [Cloud Shell window](https://shell.azure.com) and ensure that it's set to Bash.
Specify your own Azure Subscription name and preferred Resource Group name bellow.

```azurecli-interactive
# Initialize these variables:
$subscriptionId = [Your Azure Subscription name]
$resourceGroupName = [Your Azure Resource Group name]
$location = "eastus"
$projectName ="[Device Simulator name]"

$IoTHubName = $projectName + "-IoTHub"
$storageAccountName = $projectName.ToLower()+"storage"
$IoTHubDevice1 = "Device1"

# Login and set subscription
az login
az account set -s $subscriptionId

# Create the resource group in the specified location
az group create --name $resourceGroupName --location $location

# Create IoT Hub
az iot hub create -n $iotHubName -g $resourceGroupName --location $location --sku S1

# Create IoT Hub Device
az iot hub device-identity create -d $IoTHubDevice1 --hub-name $iotHubName -g $resourceGroupName

# Saving recently created device connection string to the variable
$deviceConnectionString=$(az iot hub device-identity show-connection-string -n $iotHubName -d $deviceId --query connectionString -o tsv)

# Create Storage Account
az storage account create -n $storageAccountName -g $resourceGroupName -l $location --sku Standard_LRS

# Saving Storage account connection string to the variable
$storageConnectionString = $(az storage account show-connection-string -g $resourceGroupName -n $storageAccountName --subscription $subscriptionId --query connectionString -o tsv)

# Saving Storage account Key string to the variable
$storageAccountKey = $(az storage account keys list -g $resourceGroupName -n $storageAccountName --query '[0].value' -o json)

# Deploy a Device Simulator function app with source files deployed from the specified GitHub repo.
az functionapp create --name $deviceSimFunctionAppName --storage-account $storageAccountName --consumption-plan-location $location --resource-group $resourceGroupName --deployment-source-url $deviceSimFunctionAppGitRepo --deployment-source-branch master

# Configure Device Simulator Application Settings
az functionapp config appsettings set --name $deviceSimFunctionAppName --resource-group $resourceGroupName --settings "AzureIoTHubDeviceConnectionString=$deviceConnectionString"
az functionapp config appsettings set --name $deviceSimFunctionAppName --resource-group $resourceGroupName --settings "AzureIoTHubDeviceMessageCount=1"

# Use this command to delete resource group when no longer needed
# az group delete -n $resourceGroupName
```

At this point, the resources are all set up and the message routing is configured. You can view the message routing configuration and message enrichments in the portal.
