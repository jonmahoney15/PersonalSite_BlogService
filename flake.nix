{
  description = "Rust Dev Env";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }: let
    pkgs = nixpkgs.legacyPackages."aarch64-darwin";
  in {

    devShells."aarch64-darwin".default = pkgs.mkShell {
      buildInputs = with pkgs; [
        cargo rustc rustfmt clippy rust-analyzer
      ];
      env.RUST_SRC_PATH = "${pkgs.rust.packages.stable.rustPlatform.rustLibSrc}";
    };

  };
}
