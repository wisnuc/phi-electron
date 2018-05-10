import React from 'react'
import { SvgIcon } from 'material-ui'

const f = id => props => (
  <SvgIcon
    {...props}
    viewBox={(props && props.viewBox) || '0 0 30 30'}
    style={Object.assign({ width: 30, height: 30 }, ((props && props.style) || {}))}
  >
    <svg className="icon" aria-hidden >
      <use xlinkHref={`#${id}`} />
    </svg>
  </SvgIcon>
)

/* File type icon */
export const FolderIcon = f('icon_folder_thumb')

export const TXTIcon = f('icon_text_thumb')

export const PDFIcon = f('icon_pdf_thumb')

export const WORDIcon = f('icon_word_thumb')

export const EXCELIcon = f('icon_excel_thumb')

export const PPTIcon = f('icon_ppt_thumb')

export const PhotoIcon = f('icon_image_thumb')

export const TypeUnknownIcon = f('icon_unknow_thumb')

export const AudioIcon = f('icon_music_thumb')

export const VideoIcon = f('icon_mov_thumb')

/* Settings */
export const SambaIcon = props => (
  <SvgIcon {...props} viewBox="0 0 24 24" style={{ fill: '#FFF' }}>
    <path
      d="M12.918,5.539c0.332-1.155,0.664-2.307,0.998-3.46c0.012-0.044,0.029-0.088,0.047-0.141c0.146,0.093,0.283,0.18,0.42,0.264 c0.854,0.515,1.771,0.628,2.73,0.4c0.391-0.093,0.77-0.233,1.154-0.353c0.039-0.013,0.078-0.029,0.141-0.052 c-0.033,0.119-0.059,0.217-0.086,0.313c-0.34,1.176-0.68,2.352-1.018,3.528c-0.025,0.089-0.07,0.137-0.154,0.172 c-0.545,0.231-1.104,0.408-1.695,0.47c-0.834,0.089-1.6-0.111-2.307-0.55c-0.109-0.069-0.271-0.123-0.309-0.221 C12.8,5.811,12.883,5.663,12.918,5.539z M7.678,9.516c0.889-0.213,1.75-0.14,2.563,0.309c0.203,0.112,0.399,0.238,0.604,0.359 c0.016-0.042,0.03-0.083,0.042-0.124c0.337-1.156,0.673-2.312,1.009-3.468c0.037-0.128,0.131-0.282,0.09-0.381 c-0.042-0.105-0.209-0.164-0.325-0.237c-0.703-0.437-1.466-0.609-2.289-0.514C8.782,5.527,8.221,5.7,7.67,5.912 C7.575,5.949,7.53,6,7.501,6.098C7.222,7.082,6.938,8.064,6.656,9.046c-0.08,0.283-0.161,0.566-0.248,0.873 C6.47,9.895,6.509,9.876,6.548,9.864C6.924,9.747,7.296,9.608,7.678,9.516z M9.091,4.792c0.813-0.205,1.609-0.146,2.363,0.241 c0.253,0.129,0.494,0.282,0.744,0.426c0.009-0.01,0.016-0.017,0.018-0.023c0.372-1.281,0.742-2.563,1.116-3.844 c0.02-0.063,0-0.093-0.053-0.124C13.186,1.413,13.094,1.349,13,1.291c-0.716-0.447-1.49-0.631-2.332-0.531 C10.073,0.831,9.509,1.005,8.959,1.23C8.918,1.247,8.88,1.304,8.866,1.35C8.5,2.608,8.136,3.867,7.773,5.127 C7.765,5.154,7.764,5.183,7.759,5.222C7.818,5.2,7.862,5.183,7.908,5.169C8.301,5.041,8.691,4.895,9.091,4.792z M12.882,6.75 C12.8,6.696,12.716,6.646,12.62,6.585c-0.385,1.325-0.766,2.634-1.149,3.952c0.127,0.081,0.239,0.154,0.354,0.225 c0.733,0.459,1.526,0.642,2.391,0.526c0.572-0.076,1.115-0.246,1.646-0.461c0.039-0.016,0.078-0.067,0.09-0.109 c0.354-1.221,0.703-2.443,1.055-3.664c0.008-0.028,0.012-0.058,0.018-0.098c-0.055,0.018-0.098,0.029-0.139,0.042 c-0.564,0.185-1.139,0.325-1.734,0.365C14.326,7.416,13.57,7.206,12.882,6.75z M21.033,21.267c0,0.553-0.447,1-1,1h-6v1h-4v-1h-6 c-0.553,0-1-0.447-1-1s0.447-1,1-1h6v-1h1v-1.139H3.966c-0.553,0-1-0.447-1-1v-4c0-0.552,0.447-1,1-1h16c0.553,0,1,0.447,1,1v4 c0,0.553-0.447,1-1,1h-6.934v1.139h1v1h6C20.586,20.267,21.033,20.714,21.033,21.267z M7.919,15.167c0-0.825-0.675-1.5-1.5-1.5 s-1.5,0.676-1.5,1.5s0.675,1.501,1.5,1.501S7.919,15.992,7.919,15.167z"
    />
  </SvgIcon>
)

export const MiniDLNAIcon = props => (
  <SvgIcon {...props} viewBox="0 0 64 63" style={{ fill: '#FFF' }}>
    <path
      d="M59.61,32.624H33.375c-2.694,0-5.388,1.249-6.899,3.242v-0.037c-1.511,2.088-3.953,3.457-6.744,3.457 c-4.599,0-8.322-3.729-8.322-8.328c0-4.605,3.723-8.334,8.322-8.334c2.792,0,5.233,1.375,6.744,3.47v-0.037 c1.511,1.993,4.205,3.262,6.899,3.262h25.964c0.479-0.013,2.236-0.24,2.176-2.512C59.247,13.772,46.443,3.772,30.945,3.772 c-9.536,0-18.056,3.792-23.74,9.748c-0.912,1.35,0.038,1.766,0.896,1.886h16.939c2.694,0,5.388-1.281,6.902-3.281v0.051 c1.517-2.095,3.965-3.477,6.744-3.477c4.599,0,8.328,3.735,8.328,8.334c0,4.6-3.729,8.334-8.328,8.334 c-2.779,0-5.227-1.375-6.744-3.463v0.037c-1.514-1.993-4.208-3.242-6.902-3.242H6.54l0.069,0.006c0,0-2.738-0.158-4.404,2.202 C0.931,22.964,0,27.375,0,30.914c0,3.564,0.511,6.795,2.23,10.063c1.441,2.322,4.378,2.177,4.378,2.177l-0.107,0.013h18.539 c2.694,0,5.388-1.256,6.902-3.249v0.044c1.517-2.095,3.965-3.47,6.744-3.47c4.599,0,8.328,3.734,8.328,8.327 c0,4.606-3.729,8.335-8.328,8.335c-2.779,0-5.227-1.376-6.744-3.471v0.045c-1.514-1.994-4.208-3.269-6.902-3.269H8.117 c-0.849,0.102-1.792,0.505-0.972,1.792c5.681,5.987,14.233,9.798,23.8,9.798c15.526,0,28.349-10.019,30.576-23.097 C61.509,33.134,60.263,32.706,59.61,32.624"
    />
  </SvgIcon>
)

export const BTDownloadIcon = props => (
  <SvgIcon {...props} >
    <path
      d="M7,18l-7-6h4V6h6v6h4L7,18z M0,22h13v-2H0V22z M11.563,9.188h0.718h2.539c0.871,0,1.535-0.191,1.988-0.574 c0.455-0.382,0.683-0.94,0.683-1.672c0-0.605-0.229-1.066-0.688-1.382c-0.13-0.091-0.279-0.169-0.449-0.234 c0.088-0.042,0.168-0.089,0.239-0.142c0.439-0.309,0.659-0.762,0.659-1.357c0-0.57-0.195-1.015-0.586-1.335 c-0.391-0.32-0.934-0.482-1.626-0.482h-2.759h-0.718V9.188z M12.999,3.245h1.655c0.394,0,0.688,0.061,0.884,0.183 c0.196,0.122,0.293,0.305,0.293,0.549c0,0.283-0.093,0.495-0.278,0.635c-0.185,0.14-0.466,0.21-0.84,0.21h-1.714V3.245z M12.999,6.028h1.792c0.4,0,0.7,0.074,0.9,0.222c0.199,0.148,0.301,0.372,0.301,0.671c0,0.342-0.098,0.597-0.293,0.767 s-0.488,0.254-0.879,0.254h-1.821V6.028z M20.333,9.188h0.752h0.747V3.284H24v-0.64V2.01h-5.835v0.64v0.635h2.168V9.188z"
    />
  </SvgIcon>
)

/* Header Manu */
export const FileManage = props => (
  <SvgIcon viewBox="0 0 26 32" {...props} >
    <path fill="#FFF" fillRule="evenodd" d="M0 32V0h15l11 11v21H0zm24-20.172L14.171 2H2v28h22V11.828zM26 0v8l-8-8h8z" />
  </SvgIcon>
)

export const TransIcon = props => (
  <SvgIcon viewBox="0 0 30 32" {...props} >
    <path fill="#FFF" opacity=".702" fillRule="evenodd" d="M27.671 11.388l-5.714-5.823v25.72h-1.973V.712l9.082 9.255-1.395 1.421zM2.267 20.96l5.714 5.823V1.647h1.973v29.99L.872 22.381l1.395-1.421z" />
  </SvgIcon>
)

export const DeviceChangeIcon = props => (
  <SvgIcon viewBox="0 0 33 30" {...props}>
    <path fill="#FFF" fillRule="evenodd" d="M20.134 1.542L21.531.115l5.928 6.057-1.397 1.427-5.928-6.057zm1.397 18.172l-1.397-1.428 7.206-7.362H10.953V8.905H32.11L21.531 19.714zM2.062 4.866v20.191c0 1.114.886 2.019 1.976 2.019h21.735c1.089 0 1.976-.905 1.976-2.019V20.01h1.976v5.047c0 2.227-1.772 4.039-3.952 4.039H4.038c-2.18 0-3.952-1.812-3.952-4.039V4.866C.086 2.64 1.858.828 4.038.828h6.915v2.02H4.038c-1.09 0-1.976.905-1.976 2.018z" opacity=".702" />
  </SvgIcon>
)

export const FuncIcon = props => (
  <SvgIcon viewBox="0 0 30 30" {...props}>
    <path fill="#FFF" fillRule="evenodd" d="M26 30h-6c-2.206 0-4-1.794-4-4V16h10a4.003 4.003 0 0 1 3.999 4v6c0 2.206-1.793 4-3.999 4zm2-10c0-1.103-.898-2-2-2h-8v8c0 1.103.897 2 2 2h6c1.102 0 2-.897 2-2v-6zm-2-6H16V4c0-2.206 1.794-4 4-4h6a4.003 4.003 0 0 1 3.999 4v6c0 2.206-1.793 4-3.999 4zm2-10c0-1.103-.898-2-2-2h-6c-1.103 0-2 .897-2 2v8h8c1.102 0 2-.897 2-2V4zM10 30H4c-2.206 0-4-1.794-4-4v-6c0-2.206 1.794-4 4-4h9.999v10c0 2.206-1.793 4-3.999 4zm2-12H4c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2h6c1.102 0 2-.897 2-2v-8zM0 10V4c0-2.206 1.794-4 4-4h6a4.003 4.003 0 0 1 3.999 4v10H4c-2.206 0-4-1.794-4-4zm12-6c0-1.103-.898-2-2-2H4c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2h8V4z" opacity=".702" />
  </SvgIcon>
)

/* window action */
export const MinIcon = f('icon_windows_mini')

export const MaxIcon = f('icon_windows_full')

export const CloseIcon = f('icon_windows_close')

/* Toolbar in home */
export const UploadFile = f('icon_fileupload')

export const UploadFold = f('icon_folderupload')

export const RefreshAltIcon = f('icon_refresh')

export const ForwardIcon = f('icon_back')

export const BackwardIcon = f('icon_forward')

export const DownloadIcon = f('icon_download')

export const UploadIcon = f('icon_upload')

export const DeleteIcon = f('icon_del_list')

export const NewFolderIcon = f('icon_folder_add')

export const ListIcon = f('icon_thumbnail_list')

export const GridIcon = f('icon_thumbnail')

export const BackIcon = f('icon_arrow_back')

export const HelpIcon = f('icon_help')

export const AllFileIcon = f('icon_folder_thumb')

export const MyDocIcon = f('icon_doc')

export const MyMusicIcon = f('icon_music')

export const MyPicIcon = f('icon_image')

export const MyVideoIcon = f('icon_mov')

export const UploadingIcon = f('icon_upload_trans')

export const DownloadingIcon = f('icon_download_trans')

export const FinishedIcon = f('icon_download_finsh_')

export const StartAllIcon = f('icon_start_all')

export const PauseAllIcon = f('icon_pause_all')

export const DeleteAllIcon = f('icon_del_all')

export const TaskStartIcon = f('icon_start_list')

export const TaskPauseIcon = f('icon_pause_list')

export const TaskDeleteIcon = f('icon_del_list')

export const OpenFolderIcon = f('icon_folder_list')

export const PublicIcon = f('icon_commondisk')

export const AddDriveIcon = f('icon_diskadd')

export const PersonIcon = f('icon_personal')

export const UsersIcon = f('icon_user')

export const LogoutIcon = f('icon_logout')

export const DownloadFileIcon = f('icon_windows_downloa')

export const ArrowIcon = f('icon_arrow_down')

export const SearchIcon = f('icon_search')

export const CheckedIcon = props => (
  <SvgIcon viewBox="0 0 9.5 7.5" {...props}>
    <path fill="none" stroke="#FFF" d="M1.499 2.5l2.001 2 4-4" />
  </SvgIcon>
)

export const RefreshIcon = props => (
  <SvgIcon viewBox="0 0 20 20" {...props}>
    <path fill="#7D868F" fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 5.522 4.477 10 10 10 5.522 0 10-4.478 10-10 0-5.523-4.478-10-10-10zm0 15c-2.757 0-5-2.243-5-5s2.243-5 5-5V3l4 3-4 3V7c-1.655 0-3 1.345-3 3 0 1.654 1.345 3 3 3a3.004 3.004 0 0 0 2.794-4.096l1.861-.731A5.006 5.006 0 0 1 10 15z" />
  </SvgIcon>
)

export const CircleIcon = () => (
  <svg width="24px" height="24px" viewBox="0 0 24 24" fill="rgba(255,255,255,0.54)">
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42
      0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
    />
  </svg>
)

export const GIFFont = props => (
  <SvgIcon {...props} >
    <path
      d="M5.581,17.298c-1.463,0-2.624-0.472-3.482-1.415c-0.859-0.943-1.289-2.22-1.289-3.828c0-1.641,0.447-2.943,1.34-3.907 s2.102-1.446,3.623-1.446C6.993,6.702,8,7.007,8.79,7.618c0.791,0.611,1.252,1.436,1.385,2.475H8.076 C8.021,9.655,7.774,9.271,7.337,8.941S6.415,8.445,5.886,8.445c-0.912,0-1.626,0.315-2.142,0.947s-0.773,1.507-0.773,2.628 c0,1.139,0.247,2.006,0.742,2.602c0.494,0.594,1.218,0.892,2.171,0.892H5.877c0.812,0,1.445-0.31,1.901-0.93 c0.25-0.351,0.436-0.763,0.554-1.237v-0.021H5.966v-1.729h4.209v5.421H8.773l-0.205-1.299l-0.123,0.164 c-0.706,0.943-1.663,1.415-2.871,1.415H5.581z M11.979,6.976h1.046h1.053v10.049h-1.046h-1.053V6.976z M16.04,17.024V6.976h7.15 v0.889V8.76h-5.052v2.283h4.402v0.861v0.868h-4.402v4.252h-1.046H16.04z"
    />
  </SvgIcon>
)
