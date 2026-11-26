import { Bot, User, Settings, Menu, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface HeaderProps {
  userRole: 'student' | 'teacher';
  userName?: string;
  userEmail?: string;
  onMenuClick?: () => void;
  onHomeClick?: () => void;
  onProfile?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
}

export function Header({ userRole, userName, userEmail, onMenuClick, onHomeClick, onProfile, onSettings, onLogout }: HeaderProps) {
  return (
    <header className="bg-[#28391e] text-[#fdfaf0] border-b border-white/10 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg text-[#fdfaf0]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onHomeClick}
              className="flex items-center gap-2.5 rounded-lg border-0 bg-transparent p-0 text-left outline-none transition-opacity hover:opacity-90 focus:outline-none focus:ring-0"
              aria-label={`Ir al inicio ${userRole === 'teacher' ? 'del docente' : 'del estudiante'}`}
            >
              <div className="w-10 h-10 bg-[#fe822f] rounded-xl flex items-center justify-center shadow-sm">
                <Bot className="w-6 h-6 text-[#1a180f]" />
              </div>
              <div>
                <h1 className="tracking-tight font-extrabold text-[#fdfaf0]">LideraBot</h1>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#dcd2a4]">
                  {userRole === 'student' ? 'Tu mentor virtual' : 'Panel Docente'}
                </p>
              </div>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full text-[#efe6bf] hover:bg-white/10 hover:text-white" onClick={onSettings} aria-label="Abrir configuración">
              <Settings className="w-5 h-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-[#4a3649] text-[#fdfaf0] font-bold">
                      {userRole === 'student' ? 'ES' : 'PF'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {userName && (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
                      {userEmail && (
                        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                      )}
                      <p className="text-xs text-muted-foreground capitalize">{userRole === 'student' ? 'Estudiante' : 'Docente'}</p>
                    </div>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={onProfile}>
                  <User className="w-4 h-4 mr-2" />
                  Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSettings}>
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-500 focus:text-red-500">
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
