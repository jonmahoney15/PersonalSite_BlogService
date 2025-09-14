{
  description = "Rust Dev Env";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs {
        inherit system;
      };
    in {

      devShells.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          cargo rustc rustfmt clippy rust-analyzer podman git zsh podman-compose gcc
        ];
        env.RUST_SRC_PATH = "${pkgs.rust.packages.stable.rustPlatform.rustLibSrc}";
      };

      shellHook = ''
        export SHELL=${pkgs.zsh}/bin/zsh
        exec ${pkgs.zsh}/bin/zsh
        echo "🦀 Welcome to the Rust dev shell on ${system}"
      '';
    }
  );
}
