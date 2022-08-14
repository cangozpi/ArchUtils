# import matplotlib.pyplot as plt
# import ezdxf
# from ezdxf.addons.drawing import RenderContext, Frontend
# from ezdxf.addons.drawing.matplotlib_backend import MatplotlibBackend

# filePath = "./IsohipsTest.dxf"

# doc = ezdxf.readfile(filePath)
# fig = plt.figure()
# out = MatplotlibBackend(fig.add_axes([0, 0, 1, 1]))
# Frontend(RenderContext(doc), out).draw_layout(doc.modelspace(), finalize=True)
# #fig.savefig(os.path.join(temp_output_dir, outputfilebase + ".png"), dpi=300)
# fig.savefig(os.path.join(temp_output_dir, outputfilebase + ".svg"))

# ---------------------


# Open the target document
doc = self.Document()
pdf = self.Document()
pdf = self.dataDir + 'input1.pdf'

# instantiate an object of SvgSaveOptions
save_options = self.SvgSaveOptions()

# do not compress SVG image to Zip archive
save_options.CompressOutputToZipArchive = False

# Save the output to XLS format
doc.save(self.dataDir + "Output1.svg", save_options)

print("Document has been converted successfully")
