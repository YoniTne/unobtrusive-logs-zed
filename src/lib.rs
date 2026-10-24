use zed_extension_api::{self as zed, LanguageServerId, Result};

struct UnobtrusiveLogs;

impl zed::Extension for UnobtrusiveLogs {
    fn new() -> Self {
        Self
    }

    fn language_server_command(
        &mut self,
        _id: &LanguageServerId,
        _worktree: &zed::Worktree,
    ) -> Result<zed::Command> {
        Ok(zed::Command {
            command: zed::node_binary_path()?,
            args: vec![
                "/mnt/Projects/10_Perso/17_Extensions/unobtrusive-logs-zed/server/dist/server.js"
                    .into(),
                "--stdio".into(),
            ],
            env: Default::default(),
        })
    }
}

zed::register_extension!(UnobtrusiveLogs);
