import { BlockBlobClient } from "@azure/storage-blob";

const uploadImage = async (file: File): Promise<string> => {
  // TODO: 環境変数化
  const accountName = "<storage account name>";
  const containerName = "<starage account container name>";
  // TODO: ファイル名秘匿化
  const fileName = "<file name>";
  const uploadUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}`;
  // TODO: sasトークン取得処理
  const sasToken = "<sas token>";

  // TODO: blob名秘匿化
  const sasUrl = `${uploadUrl}?${sasToken}`;
  console.log(`\nBlobUrl = ${sasUrl}\n`);

  const blockBlobClient = new BlockBlobClient(sasUrl);
  await blockBlobClient.upload(file, file.size, undefined);

  return uploadUrl;
};

export { uploadImage };
