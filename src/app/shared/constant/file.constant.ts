
//Cái này sẽ phù hợp với tỷ lệ giữa các đơn vị đo lường file size với byte
//Đặt giúp tôi 1 cái tên hợp lý hơn

export enum FileSizeUnit {
  KB = 1024,
  MB = 1024 * 1024,
  GB = 1024 * 1024 * 1024,
  TB = 1024 * 1024 * 1024 * 1024
}

export enum FileType {
  KB = 'KB',
  MB = 'MB',
  GB = 'GB',
  TB = 'TB'
}