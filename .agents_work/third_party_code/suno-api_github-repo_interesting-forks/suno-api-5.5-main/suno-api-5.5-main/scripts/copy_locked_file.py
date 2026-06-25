import ctypes
import shutil
import sys
from ctypes import wintypes
from pathlib import Path

GENERIC_READ = 0x80000000
FILE_SHARE_READ = 0x00000001
FILE_SHARE_WRITE = 0x00000002
FILE_SHARE_DELETE = 0x00000004
OPEN_EXISTING = 3
FILE_ATTRIBUTE_NORMAL = 0x80


def copy_locked_file(source: Path, destination: Path) -> None:
    kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
    handle = kernel32.CreateFileW(
        str(source),
        GENERIC_READ,
        FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE,
        None,
        OPEN_EXISTING,
        FILE_ATTRIBUTE_NORMAL,
        None,
    )
    if handle == wintypes.HANDLE(-1).value:
        raise ctypes.WinError(ctypes.get_last_error())

    destination.write_bytes(b"")
    out = destination.open("wb")
    buffer = (ctypes.c_char * 65536)()
    bytes_read = wintypes.DWORD()
    try:
        while True:
            ok = kernel32.ReadFile(handle, buffer, len(buffer), ctypes.byref(bytes_read), None)
            if not ok:
                raise ctypes.WinError(ctypes.get_last_error())
            if bytes_read.value == 0:
                break
            out.write(buffer.raw[: bytes_read.value])
    finally:
        out.close()
        kernel32.CloseHandle(handle)


if __name__ == "__main__":
    copy_locked_file(Path(sys.argv[1]), Path(sys.argv[2]))
    print("copied")