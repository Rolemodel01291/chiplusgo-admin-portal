import AcademyAppConfig from './academy/AcademyAppConfig';
import CalendarAppConfig from './account/AccountAppConfig';
import ChatAppConfig from './chat/ChatAppConfig';
import ContactsAppConfig from './contacts/ContactsAppConfig';
import AnalyticsDashboardAppConfig from './dashboards/analytics/AnalyticsDashboardAppConfig';
import ProjectDashboardAppConfig from './dashboards/project/ProjectDashboardAppConfig';
import ECommerceAppConfig from './e-commerce/ECommerceAppConfig';
import FileManagerAppConfig from './file-manager/FileManagerAppConfig';
import MailAppConfig from './mail/MailAppConfig';
import NotesAppConfig from './notes/NotesAppConfig';
import ScrumboardAppConfig from './scrumboard/ScrumboardAppConfig';
import TodoAppConfig from './todo/TodoAppConfig';
import DealsAppConfig from './deals/DealsAppConfig'

const appsConfigs = [
	AnalyticsDashboardAppConfig,
	ProjectDashboardAppConfig,
	MailAppConfig,
	TodoAppConfig,
	FileManagerAppConfig,
	ContactsAppConfig,
	CalendarAppConfig,
	ChatAppConfig,
	ECommerceAppConfig,
	ScrumboardAppConfig,
	AcademyAppConfig,
	NotesAppConfig,
	DealsAppConfig
];

export default appsConfigs;
