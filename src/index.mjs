import useAsset from './Functions/useAsset.js'
import useAuth from './Functions/useAuth.js'
import useDarkMode from './Functions/useDarkMode.js'
import useDebounce from './Functions/useDebounce.js'
import useDownloader from './Functions/useDownloader.js'
import useList from './Functions/useList.js'
import useLocale from './Functions/useLocale.js'
import useRequest from './Functions/useRequest.js'
import useTable from './Functions/useTable.js'

import filters from './filters.js'

import BooleanIcon from './Components/BooleanIcon.vue'
import Alert from './Components/Alert.vue'
import DialogForm from './Components/DialogForm.vue'
import DialogModal from './Components/DialogModal.vue'
import Drawer from './Components/Drawer.vue'
import Dropdown from './Components/Dropdown.vue'
import Collapse from './Components/Collapse.vue'
import ListFooter from './Components/ListFooter.vue'
import ListHeader from './Components/ListHeader.vue'
import ListPagination from './Components/ListPagination.vue'
import Loader from './Components/Loader.vue'
import Modal from './Components/Modal.vue'
import RequestButton from './Components/RequestButton.vue'
import RequestError from './Components/RequestError.vue'
import RequestState from './Components/RequestState.vue'
import RequestStatus from './Components/RequestStatus.vue'
import TableSortLabel from './Components/TableSortLabel.vue'
import InputDate from './Components/InputDate.vue'
import InputFile from './Components/InputFile.vue'
import InputImage from './Components/InputImage.vue'
import InputImages from './Components/InputImages.vue'
import InputMultiselect from './Components/InputMultiselect.vue'
import LabelValue from './Components/LabelValue.vue'
import Editor from './Components/Editor.vue'
import GenericForm from './Components/GenericForm.vue'
import GenericTable from './Components/GenericTable.vue'
import GenericSingleton from './Components/GenericSingleton.vue'

let functions = {
    useAsset,
    useAuth,
    useDarkMode,
    useDebounce,
    useDownloader,
    useList,
    useLocale,
    useRequest,
    useTable,
};

let components = {
    BooleanIcon,
    Alert,
    DialogForm,
    DialogModal,
    Drawer,
    Dropdown,
    Collapse,
    ListFooter,
    ListHeader,
    ListPagination,
    Loader,
    Modal,
    RequestButton,
    RequestError,
    RequestState,
    RequestStatus,
    TableSortLabel,
    InputDate,
    InputFile,
    InputImage,
    InputImages,
    InputMultiselect,
    LabelValue,
    Editor,
    GenericForm,
    GenericTable,
    GenericSingleton,
};

export {
    filters,
    functions,
    components,
}
